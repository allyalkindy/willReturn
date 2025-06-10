import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaUserFriends, FaChartLine } from 'react-icons/fa';
import ReactConfetti from 'react-confetti';
import axios from 'axios';

// Add these new styles and animations
const gradientText = {
  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FF6B6B, #96CEB4)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  backgroundSize: '400% 400%',
  animation: 'gradient 12s ease infinite'
};

const cardStyle = {
  background: 'rgba(13, 17, 38, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px) scale(1.01)'
  }
};

const selectStyle = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4ECDC4',
    borderWidth: '2px',
  },
  '& .MuiSelect-select': {
    color: 'white !important',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(255, 255, 255, 0.7)',
    opacity: 1,
  },
  '& .MuiInputBase-input': {
    color: 'white !important',
  },
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  '& .MuiSelect-select.MuiSelect-select': {
    color: 'white !important',
  },
  '& .MuiSelect-select:focus': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4ECDC4',
  },
  '& .MuiInputLabel-root.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiSelect-nativeInput': {
    color: 'white !important',
  },
};

const menuItemStyle = {
  backgroundColor: 'rgba(13, 17, 38, 0.95)',
  color: 'white !important',
  '&:hover': {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(78, 205, 196, 0.3)',
    },
  },
};

const tableStyle = {
  backgroundColor: 'rgba(13, 17, 38, 0.95)',
  '& .MuiTableCell-root': {
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    color: 'white',
    fontWeight: 'bold',
  },
  '& .MuiTableBody-root .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(78, 205, 196, 0.05)',
  },
};

const typographyStyle = {
  color: 'white',
};

const buttonStyle = {
  background: 'linear-gradient(45deg, #4ECDC4, #45B7D1)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #3DBEB6, #34A6C0)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  },
  '&.Mui-disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
};

const predictionStyle = (prediction) => ({
  background: prediction === 1 
    ? 'linear-gradient(45deg, rgba(78,205,196,0.15), rgba(69,183,209,0.15))'
    : 'linear-gradient(45deg, rgba(255,107,107,0.15), rgba(255,82,82,0.15))',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
});

const modalStyle = {
  backgroundColor: 'rgba(13, 17, 38, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
};

const alertStyle = {
  background: 'rgba(255,107,107,0.9)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  '& .MuiAlert-icon': {
    color: 'white',
  },
};

const formControlStyle = {
  '& label': {
    color: 'rgba(255,255,255,0.9) !important',
  },
  '& label.Mui-focused': {
    color: '#4ECDC4 !important',
  },
};

// First, add these new styles near your other style definitions
const titleStyle = {
  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEEAD, #FF6B6B)',
  backgroundSize: '300% 300%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'gradient 8s ease infinite',
  textShadow: '0 0 20px rgba(78,205,196,0.3)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(78,205,196,0.2), rgba(69,183,209,0.2))',
    filter: 'blur(20px)',
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)',
    zIndex: -1,
  }
};

// Add these new animations to your CSS
const globalStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(78,205,196,0.5); }
    50% { box-shadow: 0 0 20px rgba(78,205,196,0.8); }
    100% { box-shadow: 0 0 5px rgba(78,205,196,0.5); }
  }

  @keyframes borderGlow {
    0% { border-color: rgba(78,205,196,0.5); }
    50% { border-color: rgba(78,205,196,0.8); }
    100% { border-color: rgba(78,205,196,0.5); }
  }

  @keyframes titleGlow {
    0% { text-shadow: 0 0 20px rgba(78,205,196,0.3); }
    50% { text-shadow: 0 0 30px rgba(78,205,196,0.6); }
    100% { text-shadow: 0 0 20px rgba(78,205,196,0.3); }
  }

  @keyframes titlePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  .floating {
    animation: float 8s ease-in-out infinite;
  }

  .pulse {
    animation: pulse 4s ease-in-out infinite;
  }

  .shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 1000px 100%;
    animation: shimmer 3s infinite linear;
  }

  .glow {
    animation: glow 3s ease-in-out infinite;
  }

  .border-glow {
    animation: borderGlow 3s ease-in-out infinite;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .hover-scale {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-scale:hover {
    transform: scale(1.02) translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

function App() {
  const [selectedModel, setSelectedModel] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [retailCustomer, setRetailCustomer] = useState({
    Age: '',
    Gender: '',
    'Item Purchased': '',
    Category: '',
    'Purchase Amount (USD)': '',
    Location: '',
    Size: '40',
    Color: 'Blue',
    Season: 'Summer',
    'Review Rating': '4.5',
    'Subscription Status': '',
    'Shipping Type': '',
    'Discount Applied': '',
    'Promo Code Used': 'Yes',
    'Previous Purchases': '',
    'Payment Method': '',
    'Frequency of Purchases': ''
  });

  // First, let's define the Dar es Salaam streets as a constant
  const DAR_ES_SALAAM_STREETS = [
    'Azikiwe Street',
    'Samora Avenue',
    'Ohio Street',
    'Jamhuri Street',
    'Morogoro Road',
    'Nyerere Road',
    'Bagamoyo Road',
    'Bibi Titi Mohamed Street',
    'Sokoine Drive',
    'Maktaba Street',
    'Chole Road',
    'Haile Selassie Road',
    'Kawawa Road',
    'Ali Hassan Mwinyi Road',
    'Mwai Kibaki Road',
    'Uhuru Street',
    'Msimbazi Street',
    'Lumumba Street',
    'Jangwani Street',
    'Mandela Road',
    'Shekilango Road',
    'Morocco Road',
    'Kilwa Road',
    'Aggrey Street',
    'Zanaki Street'
  ];

  // First, let's create an array of emails
  const customerEmails = [
    'john.mwale@gmail.com',
    'sarah.nyaki@yahoo.com',
    'abdul.rahman@outlook.com',
    'emmanuel.kibwana@hotmail.com',
    'aisha.kassim@gmail.com',
    'david.mwinyi@gmail.com',
    'rebecca.macha@yahoo.com',
    'juma.ndugulile@outlook.com',
    'grace.mtemvu@gmail.com',
    'hassan.abdallah@yahoo.com',
    'fatma.kulwa@gmail.com',
    'stephen.ndele@gmail.com',
    'mariam.mtwale@hotmail.com',
    'kelvin.kasanga@outlook.com',
    'angelina.mwenda@gmail.com',
    'allymohammedsaid126@gmail.com',
    'wingwimapofu28@gmail.com',
    'salehabd752@gmail.com',
    'neha.gupta@clirnet.com',
    'enartha.rweyemamu@dit.ac.tz',
    'gsanga@gmail.com',
    'tekfluent@gmail.com',
    'yasiralihamad63@gmail.com'
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update the users data mapping to include emails
  const users = `50,Male,Hat,Accessories,25000,Azikiwe Street,L,Beige,Spring,2.9,No,2-Day Shipping,No,No,45,PayPal,Quarterly
49,Male,Shoes,Footwear,75000,Samora Avenue,M,Gold,Fall,4.8,No,Next Day Air,No,No,38,Cash,Annually
37,Male,Sunglasses,Accessories,35000,Ohio Street,L,Black,Fall,2.9,No,Store Pickup,No,No,41,Venmo,Monthly
63,Male,Dress,Clothing,45000,Jamhuri Street,M,Brown,Spring,2.7,No,Store Pickup,No,No,29,PayPal,Every 3 Months
54,Male,Hat,Accessories,85000,Morogoro Road,S,Yellow,Fall,4.7,No,2-Day Shipping,No,No,1,PayPal,Fortnightly
61,Female,Pants,Clothing,65000,Nyerere Road,L,Indigo,Fall,4.6,No,Standard,No,No,12,Credit Card,Annually
49,Male,Jacket,Outerwear,95000,Bagamoyo Road,M,Cyan,Fall,4.3,No,Store Pickup,No,No,39,PayPal,Every 3 Months
40,Male,Skirt,Clothing,55000,Bibi Titi Mohamed Street,L,Orange,Fall,2.8,No,Store Pickup,No,No,12,PayPal,Every 3 Months
34,Male,Jewelry,Accessories,40000,Sokoine Drive,S,Magenta,Spring,4.3,No,Free Shipping,No,No,24,Credit Card,Monthly
26,Male,Shoes,Footwear,90000,Maktaba Street,L,Beige,Spring,4.7,Yes,Standard,Yes,Yes,11,Debit Card,Annually
25,Male,Jewelry,Accessories,30000,Chole Road,M,Black,Winter,4.8,No,Next Day Air,Yes,Yes,25,Cash,Quarterly
69,Male,Gloves,Accessories,60000,Haile Selassie Road,L,Peach,Winter,4.7,No,Standard,No,No,31,Debit Card,Monthly
61,Male,Jacket,Outerwear,85000,Kawawa Road,L,Cyan,Spring,4.0,Yes,Express,Yes,Yes,21,Debit Card,Bi-Weekly
48,Female,Sandals,Footwear,35000,Ali Hassan Mwinyi Road,M,Yellow,Spring,3.7,No,2-Day Shipping,No,No,22,Debit Card,Annually
59,Male,Sweater,Clothing,70000,Mwai Kibaki Road,L,Maroon,Summer,4.6,No,Free Shipping,Yes,Yes,21,Debit Card,Bi-Weekly
57,Female,Shoes,Footwear,45000,Uhuru Street,S,Maroon,Winter,3.7,No,Standard,No,No,28,Credit Card,Annually
57,Female,Shorts,Clothing,55000,Msimbazi Street,M,Olive,Spring,4.3,No,Free Shipping,No,No,12,Debit Card,Bi-Weekly
24,Male,Belt,Accessories,25000,Lumumba Street,M,Charcoal,Summer,3.9,No,Free Shipping,No,No,11,Debit Card,Quarterly
46,Male,Skirt,Clothing,65000,Jangwani Street,M,Green,Spring,3.8,Yes,Standard,Yes,Yes,25,Credit Card,Every 3 Months
67,Male,Skirt,Clothing,80000,Mandela Road,L,Yellow,Winter,4.1,Yes,Express,Yes,Yes,34,Bank Transfer,Weekly
38,Female,Skirt,Clothing,40000,Shekilango Road,M,White,Fall,4.6,No,Standard,No,No,18,Bank Transfer,Fortnightly
27,Male,Jewelry,Accessories,35000,Morocco Road,S,Yellow,Winter,3.7,Yes,Store Pickup,Yes,Yes,31,PayPal,Quarterly
43,Male,Belt,Accessories,30000,Kilwa Road,L,Gray,Spring,2.6,No,Store Pickup,Yes,Yes,14,Credit Card,Quarterly`.split('\n').map((line, index) => {
    const [
      Age, Gender, ItemPurchased, Category, PurchaseAmount, Location, Size, Color, Season,
      ReviewRating, SubscriptionStatus, ShippingType, DiscountApplied, PromoCodeUsed,
      PreviousPurchases, PaymentMethod, FrequencyOfPurchases
    ] = line.split(',').map(item => item.trim());
    
    return {
      Age,
      Gender,
      'Item Purchased': ItemPurchased,
      Category,
      'Purchase Amount (USD)': PurchaseAmount,
      Location,
      Size,
      Color,
      Season,
      'Review Rating': ReviewRating,
      'Subscription Status': SubscriptionStatus,
      'Shipping Type': ShippingType,
      'Discount Applied': DiscountApplied,
      'Promo Code Used': PromoCodeUsed,
      'Previous Purchases': PreviousPurchases,
      'Payment Method': PaymentMethod,
      'Frequency of Purchases': FrequencyOfPurchases,
      Email: customerEmails[index] || '' // Add email to the user data
    };
  });

  // Modify the handlePredict function to exclude the email when sending to the API
  const handlePredict = async () => {
    if (!selectedModel || (!selectedUser && !businessCategory)) return;
    
    setLoading(true);
    setError('');
    
    try {
      const features = businessCategory === 'wholesale' ? selectedUser : retailCustomer;
      // Create a copy of features without the email
      const { Email, ...featuresWithoutEmail } = features;
      
      const response = await axios.post('http://localhost:5000/api/predict', {
        model: selectedModel,
        features: featuresWithoutEmail
      });
      
      setPrediction(response.data.prediction);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 7000);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetailCustomerChange = (field, value) => {
    setRetailCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add this function to check if required fields are filled
  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      'Age',
      'Gender',
      'Item Purchased',
      'Category',
      'Purchase Amount (USD)',
      'Location',
      'Subscription Status',
      'Shipping Type',
      'Discount Applied',
      'Previous Purchases',
      'Payment Method',
      'Frequency of Purchases'
    ];

    return requiredFields.every(field => retailCustomer[field] !== '');
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,182,193,0.2),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(147,197,253,0.2),rgba(255,255,255,0))]" />
      
      {/* Add more floating shapes with different animations */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 floating" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 floating" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 opacity-20 floating" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/4 right-1/4 w-28 h-28 rounded-full bg-gradient-to-r from-green-500 to-teal-500 opacity-20 pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-36 h-36 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-20 floating" style={{ animationDelay: '3s' }} />
      
      {/* Add shimmering effect to the background */}
      <div className="absolute inset-0 shimmer" style={{ opacity: 0.1 }} />

      {showConfetti && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          zIndex: 9999 // This ensures confetti appears above everything
        }}>
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={prediction === 1 ? 500 : 200}
            colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
            gravity={0.3}
            wind={0.05}
            confettiSource={{ x: windowSize.width / 2, y: 0, w: 0, h: 0 }}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      )}
      
      <Container maxWidth="xl" className="py-16 px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Typography 
            variant="h2" 
            className="text-center mb-20 pb-20 italic font-black relative"
            sx={{
              ...titleStyle,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
              letterSpacing: '0.05em',
              lineHeight: 1.2,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center gap-4"
            >
              <span className="text-[#FF6B6B]">CUSTOMER</span>
              <span 
                className="text-5xl md:text-6xl lg:text-7xl"
                style={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(78,205,196,0.4)',
                }}
              >
                RETURN
              </span>
              <span className="text-[#4ECDC4]">PREDICTION</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#4ECDC4] to-transparent"
            />
          </Typography>
        </motion.div>

        <Paper 
          elevation={3} 
          className="p-12 rounded-2xl"
          style={cardStyle}
        >
          <Box className="space-y-12">
            {/* Model Selection Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-extrabold pb-10" style={gradientText}>Step 1: Select Model</Typography>
              <FormControl
                fullWidth
                className="transform hover:scale-[1.02] transition-transform duration-300"
                sx={formControlStyle}
              >
                <InputLabel className="text-lg">Select Model</InputLabel>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-white/80 text-lg rounded-xl"
                  sx={selectStyle}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(13, 17, 38, 0.95)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(78, 205, 196, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(78, 205, 196, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(78, 205, 196, 0.3)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="Random_forest">Random Forest</MenuItem>
                  <MenuItem value="lgbmc_Classifier">LGBMC Classifier</MenuItem>
                  <MenuItem value="Extra_tree_classifier">Extra Trees Classifier</MenuItem>
                  <MenuItem value="Gradient_Boosting_classifier">Gradient Boosting</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Business Category Selection Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-extrabold pb-10" style={gradientText}>Step 2: Select Business Category</Typography>
              <FormControl
                fullWidth
                className="transform hover:scale-[1.02] transition-transform duration-300"
                sx={formControlStyle}
              >
                <InputLabel className="text-lg">Business Category</InputLabel>
                <Select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="bg-white/80 text-lg rounded-xl"
                  sx={selectStyle}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(13, 17, 38, 0.95)',
                        '& .MuiMenuItem-root': {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(78, 205, 196, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(78, 205, 196, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(78, 205, 196, 0.3)',
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="wholesale">Wholesale</MenuItem>
                  <MenuItem value="retail">Retail (Reja Reja)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Customer Selection/Details Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-extrabold" style={gradientText}>
                Step 3: {businessCategory === 'wholesale' ? 'Select Customer' : 'Enter Customer Details'}
              </Typography>
              
              {businessCategory === 'wholesale' ? (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setOpenModal(true)}
                    className="h-14 text-lg rounded-xl transform hover:scale-[1.02] transition-all duration-300"
                    sx={buttonStyle}
                    startIcon={<FaUserFriends className="text-xl" />}
                  >
                    Select Customer
                  </Button>

                  {selectedUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl"
                      style={{
                        background: 'rgba(13, 17, 38, 0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Typography
                        variant="h6"
                        className="mb-3 font-semibold"
                        sx={{ color: 'rgba(255,255,255,0.9)' }}
                      >
                        Selected Customer:
                      </Typography>
                      <Typography className="text-lg" sx={{ color: 'white' }}>
                        {selectedUser.Gender}, {selectedUser.Age} years old - {selectedUser['Item Purchased']} ({selectedUser.Category})
                      </Typography>
                      {selectedUser.Email && (
                        <Typography className="text-sm mt-2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {selectedUser.Email}
                        </Typography>
                      )}
                    </motion.div>
                  )}
                </>
              ) : (
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Age</InputLabel>
                    <Select
                      value={retailCustomer.Age}
                      onChange={(e) => handleRetailCustomerChange('Age', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                        <MenuItem key={age} value={age.toString()}>{age}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={retailCustomer.Gender}
                      onChange={(e) => handleRetailCustomerChange('Gender', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Item Purchased</InputLabel>
                    <Select
                      value={retailCustomer['Item Purchased']}
                      onChange={(e) => handleRetailCustomerChange('Item Purchased', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {['Hat', 'Shoes', 'Sunglasses', 'Dress', 'Jacket', 'Skirt', 'Jewelry', 'Belt', 'Gloves', 'Sandals', 'Sweater', 'Shorts', 'Pants'].map(item => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={retailCustomer.Category}
                      onChange={(e) => handleRetailCustomerChange('Category', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {['Accessories', 'Footwear', 'Clothing', 'Outerwear'].map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Purchase Amount (TZS)</InputLabel>
                    <Select
                      value={retailCustomer['Purchase Amount (USD)']}
                      onChange={(e) => handleRetailCustomerChange('Purchase Amount (USD)', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {Array.from({ length: 91 }, (_, i) => (i + 10) * 1000).map(amount => (
                        <MenuItem key={amount} value={amount.toString()}>{amount.toLocaleString()}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={retailCustomer.Location}
                      onChange={(e) => handleRetailCustomerChange('Location', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {DAR_ES_SALAAM_STREETS.map(location => (
                        <MenuItem key={location} value={location}>{location}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Subscription Status</InputLabel>
                    <Select
                      value={retailCustomer['Subscription Status']}
                      onChange={(e) => handleRetailCustomerChange('Subscription Status', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Shipping Type</InputLabel>
                    <Select
                      value={retailCustomer['Shipping Type']}
                      onChange={(e) => handleRetailCustomerChange('Shipping Type', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="Standard Delivery">Standard Delivery</MenuItem>
                      <MenuItem value="Express Delivery">Express Delivery</MenuItem>
                      <MenuItem value="Same Day Delivery">Same Day Delivery</MenuItem>
                      <MenuItem value="Store Pickup">Store Pickup</MenuItem>
                      <MenuItem value="Boda Boda Delivery">Boda Boda Delivery</MenuItem>
                      <MenuItem value="Tuk Tuk Delivery">Tuk Tuk Delivery</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Discount Applied</InputLabel>
                    <Select
                      value={retailCustomer['Discount Applied']}
                      onChange={(e) => handleRetailCustomerChange('Discount Applied', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Previous Purchases</InputLabel>
                    <Select
                      value={retailCustomer['Previous Purchases']}
                      onChange={(e) => handleRetailCustomerChange('Previous Purchases', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {Array.from({ length: 50 }, (_, i) => i + 1).map(purchases => (
                        <MenuItem key={purchases} value={purchases.toString()}>{purchases}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={retailCustomer['Payment Method']}
                      onChange={(e) => handleRetailCustomerChange('Payment Method', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {['Tigo Pesa', 'Airtel Money', 'M-Pesa', 'Halo Pesa', 'Cash'].map(method => (
                        <MenuItem key={method} value={method}>{method}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel>Frequency of Purchases</InputLabel>
                    <Select
                      value={retailCustomer['Frequency of Purchases']}
                      onChange={(e) => handleRetailCustomerChange('Frequency of Purchases', e.target.value)}
                      sx={selectStyle}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(13, 17, 38, 0.95)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              },
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                '&:hover': {
                                  backgroundColor: 'rgba(78, 205, 196, 0.3)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                      {['Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Annually', 'Every 3 Months', 'Fortnightly'].map(frequency => (
                        <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>

            {/* Prediction Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-extrabold" style={gradientText}>Step 4: Make Prediction</Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handlePredict}
                disabled={!selectedModel || !businessCategory || (businessCategory === 'wholesale' ? !selectedUser : !areRequiredFieldsFilled()) || loading}
                className="h-14 text-lg rounded-xl transform hover:scale-[1.02] transition-all duration-300"
                sx={buttonStyle}
                startIcon={loading ? <CircularProgress size={24} /> : <FaChartLine />}
              >
                {loading ? 'Predicting...' : 'Predict Return'}
              </Button>

              <AnimatePresence>
                {prediction !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="p-8 rounded-xl text-center"
                    style={predictionStyle(prediction)}
                  >
                    <Typography variant="h5" className="font-bold flex items-center justify-center gap-2" style={gradientText}>
                      {prediction === 1 
                        ? '🎉 Customer is likely to return! 🎉' 
                        : '😔 Customer is unlikely to return 😔'}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Paper>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          className="flex items-center justify-center"
        >
          <Box 
            className="p-8 rounded-2xl w-11/12 max-w-5xl max-h-[85vh] overflow-auto"
            style={modalStyle}
          >
            <Typography variant="h5" className="mb-6 font-bold" style={gradientText}>Select a Customer</Typography>
            <TableContainer className="rounded-xl overflow-hidden border border-gray-200" sx={tableStyle}>
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableCell className="font-bold">Age</TableCell>
                    <TableCell className="font-bold">Gender</TableCell>
                    <TableCell className="font-bold">Item Purchased</TableCell>
                    <TableCell className="font-bold" style={{ minWidth: '120px' }}>Purchase Amount</TableCell>
                    <TableCell className="font-bold">Location</TableCell>
                    <TableCell className="font-bold">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell>{user.Age}</TableCell>
                      <TableCell>{user.Gender}</TableCell>
                      <TableCell>{user['Item Purchased']}</TableCell>
                      <TableCell style={{ minWidth: '120px' }}>{user['Purchase Amount (USD)'].toLocaleString()}</TableCell>
                      <TableCell>{user.Location}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenModal(false);
                          }}
                          sx={{
                            borderColor: '#4ECDC4',
                            color: '#4ECDC4',
                            '&:hover': {
                              borderColor: '#3DBEB6',
                              backgroundColor: 'rgba(78,205,196,0.1)',
                              transform: 'translateY(-2px) scale(1.05)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError('')} 
            severity="error"
            sx={alertStyle}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
