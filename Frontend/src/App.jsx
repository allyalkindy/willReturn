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

function App() {
  const [selectedModel, setSelectedModel] = useState('');
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

  // Parse the dummy data with correct column names
  const users = `50,Male,Hat,Accessories,22,Connecticut,L,Beige,Spring,2.9,No,2-Day Shipping,No,No,45,PayPal,Quarterly
49,Male,Shoes,Footwear,76,Massachusetts,M,Gold,Fall,4.8,No,Next Day Air,No,No,38,Cash,Annually
37,Male,Sunglasses,Accessories,26,West Virginia,L,Black,Fall,2.9,No,Store Pickup,No,No,41,Venmo,Monthly
63,Male,Dress,Clothing,40,Virginia,M,Brown,Spring,2.7,No,Store Pickup,No,No,29,PayPal,Every 3 Months
54,Male,Hat,Accessories,95,Nebraska,S,Yellow,Fall,4.7,No,2-Day Shipping,No,No,1,PayPal,Fortnightly
61,Female,Pants,Clothing,68,Connecticut,L,Indigo,Fall,4.6,No,Standard,No,No,12,Credit Card,Annually
49,Male,Jacket,Outerwear,96,Hawaii,M,Cyan,Fall,4.3,No,Store Pickup,No,No,39,PayPal,Every 3 Months
40,Male,Skirt,Clothing,57,Minnesota,L,Orange,Fall,2.8,No,Store Pickup,No,No,12,PayPal,Every 3 Months
34,Male,Jewelry,Accessories,28,Delaware,S,Magenta,Spring,4.3,No,Free Shipping,No,No,24,Credit Card,Monthly
26,Male,Shoes,Footwear,90,Vermont,L,Beige,Spring,4.7,Yes,Standard,Yes,Yes,11,Debit Card,Annually
25,Male,Jewelry,Accessories,40,Connecticut,M,Black,Winter,4.8,No,Next Day Air,Yes,Yes,25,Cash,Quarterly
69,Male,Gloves,Accessories,73,Washington,L,Peach,Winter,4.7,No,Standard,No,No,31,Debit Card,Monthly
61,Male,Jacket,Outerwear,94,Indiana,L,Cyan,Spring,4.0,Yes,Express,Yes,Yes,21,Debit Card,Bi-Weekly
48,Female,Sandals,Footwear,28,Connecticut,M,Yellow,Spring,3.7,No,2-Day Shipping,No,No,22,Debit Card,Annually
59,Male,Sweater,Clothing,64,New York,L,Maroon,Summer,4.6,No,Free Shipping,Yes,Yes,21,Debit Card,Bi-Weekly
57,Female,Shoes,Footwear,33,New York,S,Maroon,Winter,3.7,No,Standard,No,No,28,Credit Card,Annually
57,Female,Shorts,Clothing,88,Idaho,M,Olive,Spring,4.3,No,Free Shipping,No,No,12,Debit Card,Bi-Weekly
24,Male,Belt,Accessories,42,New Jersey,M,Charcoal,Summer,3.9,No,Free Shipping,No,No,11,Debit Card,Quarterly
46,Male,Skirt,Clothing,95,Pennsylvania,M,Green,Spring,3.8,Yes,Standard,Yes,Yes,25,Credit Card,Every 3 Months
67,Male,Skirt,Clothing,91,Hawaii,L,Yellow,Winter,4.1,Yes,Express,Yes,Yes,34,Bank Transfer,Weekly
38,Female,Skirt,Clothing,33,Florida,M,White,Fall,4.6,No,Standard,No,No,18,Bank Transfer,Fortnightly
27,Male,Jewelry,Accessories,20,Illinois,S,Yellow,Winter,3.7,Yes,Store Pickup,Yes,Yes,31,PayPal,Quarterly
43,Male,Belt,Accessories,25,Indiana,L,Gray,Spring,2.6,No,Store Pickup,Yes,Yes,14,Credit Card,Quarterly`.split('\n').map(line => {
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
      'Frequency of Purchases': FrequencyOfPurchases
    };
  });

  const handlePredict = async () => {
    if (!selectedModel || !selectedUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/predict', {
        model: selectedModel,
        features: selectedUser
      });
      
      setPrediction(response.data.prediction);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={prediction === 1 ? 500 : 200}
          colors={prediction === 1 ? ['#4ade80', '#22c55e', '#16a34a'] : ['#ef4444', '#dc2626', '#b91c1c']}
        />
      )}
      
      <Container maxWidth="xl" className="py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h2" 
            className="text-center mb-20 font-black bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '3.5rem',
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Customer Return Prediction
          </Typography>
        </motion.div>

        <Paper elevation={3} className="p-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl">
          <Box className="space-y-12">
            {/* Model Selection Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-semibold text-gray-700">Step 1: Select Model</Typography>
              <FormControl fullWidth>
                <InputLabel className="text-lg">Select Model</InputLabel>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-white text-lg"
                >
                  <MenuItem value="Random_forest">Random Forest</MenuItem>
                  <MenuItem value="lgbmc_Classifier">LGBMC Classifier</MenuItem>
                  <MenuItem value="Extra_tree_classifier">Extra Trees Classifier</MenuItem>
                  <MenuItem value="Gradient_Boosting_classifier">Gradient Boosting</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Customer Selection Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-semibold text-gray-700">Step 2: Select Customer</Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-14 text-lg"
                startIcon={<FaUserFriends />}
              >
                Select Customer
              </Button>

              {selectedUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gray-50 rounded-xl shadow-inner"
                >
                  <Typography variant="h6" className="mb-3 font-semibold">Selected Customer:</Typography>
                  <Typography className="text-lg">
                    {selectedUser.Gender}, {selectedUser.Age} years old - {selectedUser['Item Purchased']} ({selectedUser.Category})
                  </Typography>
                </motion.div>
              )}
            </Box>

            {/* Prediction Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="font-semibold text-gray-700">Step 3: Make Prediction</Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handlePredict}
                disabled={!selectedModel || !selectedUser || loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-14 text-lg"
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
                    className={`p-6 rounded-xl text-center shadow-lg ${
                      prediction === 1 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                        : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
                    }`}
                  >
                    <Typography variant="h5" className="font-bold">
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
          <Box className="bg-white p-8 rounded-2xl w-11/12 max-w-5xl max-h-[85vh] overflow-auto shadow-2xl">
            <Typography variant="h5" className="mb-6 font-bold">Select a Customer</Typography>
            <TableContainer className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-bold">Age</TableCell>
                    <TableCell className="font-bold">Gender</TableCell>
                    <TableCell className="font-bold">Item Purchased</TableCell>
                    <TableCell className="font-bold">Purchase Amount</TableCell>
                    <TableCell className="font-bold">Location</TableCell>
                    <TableCell className="font-bold">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{user.Age}</TableCell>
                      <TableCell>{user.Gender}</TableCell>
                      <TableCell>{user['Item Purchased']}</TableCell>
                      <TableCell>${user['Purchase Amount (USD)']}</TableCell>
                      <TableCell>{user.Location}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenModal(false);
                          }}
                          className="hover:bg-purple-50"
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
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
