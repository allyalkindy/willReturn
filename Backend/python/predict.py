import sys
import json
import numpy as np
import os
from sklearn.preprocessing import LabelEncoder
import traceback
import joblib
import pickle

def debug_print(message):
    # Only print to stderr for debugging
    sys.stderr.write(f"{message}\n")
    sys.stderr.flush()

def load_pickle(filename):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, filename)
    debug_print(f"Loading model from: {file_path}")
    return joblib.load(file_path)

def encode_features(features, model):
    # Load the saved encoders
    script_dir = os.path.dirname(os.path.abspath(__file__))
    encoders_path = os.path.join(script_dir, 'encoders.pkl')
    
    try:
        with open(encoders_path, 'rb') as f:
            encoders = pickle.load(f)
    except FileNotFoundError:
        debug_print(f"Error: encoders.pkl not found at {encoders_path}")
        raise
    
    # Get the feature names from the model
    feature_names = model.feature_names_in_
    debug_print(f"Model expects features: {feature_names}")
    
    # Initialize encoded features list
    encoded_features = []
    
    # Add Customer ID (assuming it's not needed for prediction)
    encoded_features.append(0)  # Add a placeholder value for Customer ID
    
    # Process numerical features
    numerical_columns = ['Age', 'Purchase Amount (USD)', 'Review Rating', 'Previous Purchases']
    for col in numerical_columns:
        if col in features:
            value = float(features[col])
            debug_print(f"Numerical feature {col}: {value}")
            encoded_features.append(value)
        else:
            debug_print(f"Warning: Missing numerical feature {col}")
            encoded_features.append(0)
    
    # Process categorical features using saved encoders
    categorical_columns = [
        'Gender', 'Item Purchased', 'Category', 'Location', 'Size',
        'Color', 'Season', 'Subscription Status', 'Shipping Type',
        'Discount Applied', 'Promo Code Used', 'Payment Method',
        'Frequency of Purchases'
    ]
    
    for col in categorical_columns:
        if col in features:
            value = features[col]
            debug_print(f"Categorical feature {col}: {value}")
            try:
                # Use the saved encoder to transform the value
                encoded_value = encoders[col].transform([value])[0]
                debug_print(f"Encoded value for {col}: {encoded_value}")
                encoded_features.append(encoded_value)
            except ValueError as e:
                debug_print(f"Error encoding {col}: {str(e)}")
                # If the value wasn't seen during training, use a default value
                encoded_features.append(0)
        else:
            debug_print(f"Warning: Missing categorical feature {col}")
            encoded_features.append(0)
    
    # Convert to numpy array and reshape for prediction
    feature_array = np.array(encoded_features).reshape(1, -1)
    debug_print(f"Final encoded features shape: {feature_array.shape}")
    return feature_array

def main():
    debug_print("Starting main function...")
    try:
        # Check if we received the input argument
        if len(sys.argv) < 2:
            debug_print("Error: No input data provided")
            sys.exit(1)
            
        input_json = sys.argv[1]
        debug_print(f"Received input: {input_json}")
        
        # Parse the input JSON
        try:
            data = json.loads(input_json)
            debug_print(f"Parsed data: {data}")
        except json.JSONDecodeError as e:
            debug_print(f"Error parsing JSON: {str(e)}")
            sys.exit(1)

        features = data['features']
        model_choice = data['model']
        debug_print(f"Model choice: {model_choice}")

        # Load the model first
        model = load_pickle(f'{model_choice}.pkl')
        debug_print(f"Model type: {type(model)}")
        
        # Encode features using the model's feature names
        encoded_features = encode_features(features, model)
        
        # Make prediction
        debug_print("Making prediction...")
        prediction = model.predict(encoded_features)
        debug_print(f"Prediction result: {prediction}")
        
        # Create the output dictionary
        output = {'prediction': int(prediction[0])}
        debug_print(f"Final output: {output}")
        
        # Only print the JSON response to stdout
        print(json.dumps(output))
        
    except Exception as e:
        debug_print(f"Error in main: {str(e)}")
        debug_print(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main()
