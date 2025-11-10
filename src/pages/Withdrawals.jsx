// src/pages/Withdrawals.jsx
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { FaClock, FaCheckCircle, FaHistory } from 'react-icons/fa';
import access from '../assets/access.png';
import mastercard from '../assets/mastercard.png';
import angel from '../assets/angel.png';
import ModalContext from '../utils/ModalContext';

const Withdrawals = () => {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);
  const [bankCardInfo, setBankCardInfo] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BANK_CARD_API_URL = 'https://exgeid-backend.onrender.com/api/v1/finance/bank-card/info';
  const TRANSACTION_HISTORY_API_URL = 'https://exgeid-backend.onrender.com/api/v1/finance/transaction-history';
  const PAYMENT_INFO_API_URL = 'https://exgeid-backend.onrender.com/api/v1/finance/payment/info';
  const REFRESH_TOKEN_URL = 'https://exgeid-backend.onrender.com/api/v1/refresh/token';

  // Toast Functions
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: 'top-center',
      style: {
        background: '#09052C',
        color: '#CACACA',
        border: '1px solid #FEC84D',
        zIndex: 9999,
      },
      iconTheme: {
        primary: '#FEC84D',
        secondary: '#09052C',
      },
      duration: 3000,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: 'top-center',
      style: {
        background: '#09052C',
        color: '#CACACA',
        border: '1px solid #ef4444',
        zIndex: 9999,
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#09052C',
      },
      duration: 5000,
    });
  };

  // Format date from ISO to readable (e.g., "03/08/2025")
  const formatDate = (iso) => {
    if (!iso) return 'Unknown';
    try {
      const date = new Date(iso);
      if (isNaN(date.getTime())) return 'Unknown';
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  // Format amount to Naira
  const formatAmount = (amount) => {
    if (amount == null || isNaN(amount)) return '₦0.00';
    return `₦${Number(amount).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Refresh token function
  const refreshAccessToken = async (accessToken) => {
    try {
      const refreshRes = await fetch(REFRESH_TOKEN_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      if (!refreshRes.ok) {
        throw new Error(`Token refresh failed: ${refreshRes.status}`);
      }

      const refreshResponse = await refreshRes.json();
      const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.accessToken;

      if (!newAccessToken) {
        throw new Error('No new access token received');
      }

      sessionStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error('Token refresh error:', err);
      throw err;
    }
  };

  // Fetch data with retry logic
  const fetchData = async (accessToken) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch Bank Card Info
      const bankCardRes = await fetch(BANK_CARD_API_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!bankCardRes.ok) {
        const errorText = await bankCardRes.text();
        throw new Error(`Bank card request failed: ${bankCardRes.status} - ${errorText}`);
      }

      const bankCardData = await bankCardRes.json();
      const bankCard = bankCardData.data || bankCardData;
      const bankCardFallback = {
        bank_name: bankCard.bank_name || 'Not specified',
        name: bankCard.name || 'Not specified',
        account_number: bankCard.account_number || 'Not specified',
        bank_code: bankCard.bank_code || 'Not specified',
      };
      setBankCardInfo(bankCardFallback);

      // Fetch Transaction History
      const transactionRes = await fetch(TRANSACTION_HISTORY_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit: 10, cursor: '' }),
      });

      if (!transactionRes.ok) {
        const errorText = await transactionRes.text();
        throw new Error(`Transaction history request failed: ${transactionRes.status} - ${errorText}`);
      }

      const transactionData = await transactionRes.json();
      const transactionHistory = transactionData.data || transactionData;
      const transactionHistoryFallback = {
        transactionHistoryArray: Array.isArray(transactionHistory.transactionHistoryArray)
          ? transactionHistory.transactionHistoryArray.map((tx) => ({
              _id: tx._id || null,
              status: tx.status || 'Unknown',
              amount: tx.amount != null ? Number(tx.amount) : 0,
              method: tx.method || 'Not specified',
              updatedAt: tx.updatedAt || 'Unknown',
            }))
          : [],
      };
      setTransactionHistory(transactionHistoryFallback);

      // Fetch Payment Info
      const paymentRes = await fetch(PAYMENT_INFO_API_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!paymentRes.ok) {
        const errorText = await paymentRes.text();
        throw new Error(`Payment info request failed: ${paymentRes.status} - ${errorText}`);
      }

      const paymentData = await paymentRes.json();
      const paymentInfo = paymentData.data || paymentData;
      const paymentInfoFallback = {
        amountLeftInWallet: paymentInfo.amountLeftInWallet != null ? Number(paymentInfo.amountLeftInWallet) : 0,
        paymentInfo: paymentInfo.paymentInfo
          ? {
              approvedAmount: paymentInfo.paymentInfo.approvedAmount != null ? Number(paymentInfo.paymentInfo.approvedAmount) : 0,
              pendingAmount: paymentInfo.paymentInfo.pendingAmount != null ? Number(paymentInfo.paymentInfo.pendingAmount) : 0,
              paidAmount: paymentInfo.paymentInfo.paidAmount != null ? Number(paymentInfo.paymentInfo.paidAmount) : 0,
            }
          : { approvedAmount: 0, pendingAmount: 0, paidAmount: 0 },
      };
      setPaymentInfo(paymentInfoFallback);

      showSuccessToast('Withdrawal data loaded successfully!');

    } catch (err) {
      console.error('Fetch error:', err);

      // Only retry on 401 Unauthorized
      if (err.message.includes('401')) {
        try {
          const newAccessToken = await refreshAccessToken(accessToken);

          // Retry all API calls with new token
          const retryBankCardRes = await fetch(BANK_CARD_API_URL, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!retryBankCardRes.ok) {
            throw new Error(`Retry bank card failed: ${retryBankCardRes.status}`);
          }

          const retryBankCardData = await retryBankCardRes.json();
          const retryBankCard = retryBankCardData.data || retryBankCardData;
          const retryBankCardFallback = {
            bank_name: retryBankCard.bank_name || 'Not specified',
            name: retryBankCard.name || 'Not specified',
            account_number: retryBankCard.account_number || 'Not specified',
            bank_code: retryBankCard.bank_code || 'Not specified',
          };
          setBankCardInfo(retryBankCardFallback);

          const retryTransactionRes = await fetch(TRANSACTION_HISTORY_API_URL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ limit: 10, cursor: '' }),
          });

          if (!retryTransactionRes.ok) {
            throw new Error(`Retry transaction history failed: ${retryTransactionRes.status}`);
          }

          const retryTransactionData = await retryTransactionRes.json();
          const retryTransactionHistory = retryTransactionData.data || retryTransactionData;
          const retryTransactionHistoryFallback = {
            transactionHistoryArray: Array.isArray(retryTransactionHistory.transactionHistoryArray)
              ? retryTransactionHistory.transactionHistoryArray.map((tx) => ({
                  _id: tx._id || null,
                  status: tx.status || 'Unknown',
                  amount: tx.amount != null ? Number(tx.amount) : 0,
                  method: tx.method || 'Not specified',
                  updatedAt: tx.updatedAt || 'Unknown',
                }))
              : [],
          };
          setTransactionHistory(retryTransactionHistoryFallback);

          const retryPaymentRes = await fetch(PAYMENT_INFO_API_URL, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!retryPaymentRes.ok) {
            throw new Error(`Retry payment info failed: ${retryPaymentRes.status}`);
          }

          const retryPaymentData = await retryPaymentRes.json();
          const retryPaymentInfo = retryPaymentData.data || retryPaymentData;
          const retryPaymentInfoFallback = {
            amountLeftInWallet: retryPaymentInfo.amountLeftInWallet != null ? Number(retryPaymentInfo.amountLeftInWallet) : 0,
            paymentInfo: retryPaymentInfo.paymentInfo
              ? {
                  approvedAmount: retryPaymentInfo.paymentInfo.approvedAmount != null ? Number(retryPaymentInfo.paymentInfo.approvedAmount) : 0,
                  pendingAmount: retryPaymentInfo.paymentInfo.pendingAmount != null ? Number(retryPaymentInfo.paymentInfo.pendingAmount) : 0,
                  paidAmount: retryPaymentInfo.paymentInfo.paidAmount != null ? Number(retryPaymentInfo.paymentInfo.paidAmount) : 0,
                }
              : { approvedAmount: 0, pendingAmount: 0, paidAmount: 0 },
          };
          setPaymentInfo(retryPaymentInfoFallback);

          showSuccessToast('Data reloaded after session refresh.');
        } catch (refreshErr) {
          setError('Failed to load withdrawal data. Please try again later.');
          showErrorToast('Could not load withdrawal data. Please try again.');
          setBankCardInfo(null);
          setTransactionHistory(null);
          setPaymentInfo(null);
        }
      } else {
        setError('Failed to load withdrawal data. Please try again later.');
        showErrorToast(`Error: ${error}`);
        setBankCardInfo(null);
        setTransactionHistory(null);
        setPaymentInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      refreshAccessToken()
        .then((newAccessToken) => {
          fetchData(newAccessToken);
        })
        .catch(() => {
          showErrorToast('Authentication required. Please log in.');
          setError('Please login to view withdrawal data.');
          setLoading(false);
        });
      return;
    }

    fetchData(accessToken);
  }, []);

  if (loading) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="space-y-6 bg-[#020109] text-white md:p-8 min-h-screen">
          {/* Header Loading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-2 mt-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-700 rounded-full"></div>
              <div className="h-6 bg-gray-700 rounded w-48"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded-lg w-48"></div>
          </div>

          {/* Balance & Card Info Loading */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-32"></div>
                </div>
                <div className="h-10 bg-gray-700 rounded-lg w-24"></div>
              </div>
              <div className="mt-6 h-4 bg-gray-700 rounded w-32 mx-auto"></div>
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-between gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1">
                    <div className="h-3 bg-gray-700 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#110B41] to-[#430417] rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-6 bg-gray-700 rounded w-24"></div>
              </div>
              <div className="mt-4 sm:mt-6 h-5 bg-gray-700 rounded w-40"></div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                  <div className="h-3 bg-gray-700 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-700 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-16 self-end sm:self-center"></div>
              </div>
            </div>
          </div>

          {/* Transactions Loading */}
          <div className="bg-[#09052C] rounded-xl p-4 sm:p-6 animate-pulse">
            <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-700 pb-2 sm:pb-3">
              <div className="h-4 bg-gray-700 rounded w-4"></div>
              <div className="h-5 bg-gray-700 rounded w-32"></div>
            </div>
            <div className="mt-3 sm:mt-4 grid grid-cols-4 text-gray-400 text-xs sm:text-sm px-1 sm:px-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 bg-gray-700 rounded w-16 mx-auto"></div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-[#06031E] to-[#0E083C] p-3 sm:p-4 rounded-lg grid grid-cols-4 items-center"
                >
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-3 bg-gray-700 rounded w-20 mx-auto"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="bg-[#020109] min-h-screen flex items-center justify-center p-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="space-y-6 bg-[#020109] text-white md:p-8 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <img src={angel} alt="angel_top" className="w-14 h-14 sm:w-20 sm:h-20" />
            Withdraw Earnings
          </h1>
          <button
            onClick={() => navigate('?modal=withdrawal-requirements')}
            className="border border-yellow-500 text-yellow-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-yellow-500/10"
          >
            Withdrawal requirements
          </button>
        </div>

        {/* Balance & Card Info */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Balance card */}
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 sm:p-6">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <p className="text-sm sm:text-lg text-gray-300">Available Balance</p>
                <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                  {formatAmount(paymentInfo.amountLeftInWallet)}
                </h2>
              </div>
              <button 
                onClick={() => navigate('?modal=withdrawal-status')}
                className="bg-[#8F0406] px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-red-700">
                Withdraw
              </button>
            </div>
            <p className="mt-6 text-gray-300 font-semibold text-center text-sm sm:text-base">
              Total Breakdown
            </p>
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between text-sm sm:text-base gap-4 sm:gap-0">
              <div className="text-left flex-1">
                <div className="text-gray-300">Approved</div>
                <div className="font-semibold text-white mt-1">
                  {formatAmount(paymentInfo.paymentInfo.approvedAmount)}
                </div>
              </div>
              <div className="text-left flex-1">
                <div className="text-gray-300">Pending</div>
                <div className="font-semibold text-yellow-400 mt-1">
                  {formatAmount(paymentInfo.paymentInfo.pendingAmount)}
                </div>
              </div>
              <div className="text-left flex-1">
                <div className="text-gray-300">Paid</div>
                <div className="font-semibold text-green-400 mt-1">
                  {formatAmount(paymentInfo.paymentInfo.paidAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Bank Card */}
          <div className="bg-gradient-to-r from-[#110B41] to-[#430417] rounded-xl p-4 sm:p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Bank Name</p>
                <p className="text-base sm:text-lg font-semibold">{bankCardInfo.bank_name}</p>
              </div>
              <img src={access} alt="access_logo" className="w-16 sm:w-24 object-contain" />
            </div>
            <div className="mt-4 md:mt-2">
              <p className="text-gray-400 text-xs sm:text-sm">Account Number</p>
              <p className="text-lg sm:text-xl tracking-widest">{bankCardInfo.account_number}</p>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Card Holder Name</p>
                <p className="font-semibold text-white text-sm sm:text-base">
                  {bankCardInfo.name.toUpperCase()}
                </p>
              </div>
              {/*<div>
                <p className="text-gray-400 text-xs sm:text-sm">Bank Code</p>
                <p className="font-semibold text-white text-sm sm:text-base">{bankCardInfo.bank_code}</p>
              </div>*/}
              <img
                src={mastercard}
                alt="mastercard_logo"
                className="w-12 sm:w-16 object-contain self-end sm:self-center"
              />
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-[#09052C] rounded-xl p-4 sm:p-6 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-700 pb-2 sm:pb-3">
            <FaHistory className="text-white text-base sm:text-lg" />
            <h2 className="text-lg sm:text-xl font-bold">Recent Transactions</h2>
          </div>
          <div className="mt-3 sm:mt-4 grid grid-cols-4 text-gray-400 text-xs sm:text-sm px-1 sm:px-2">
            <div className="text-center">Date</div>
            <div className="text-center">Method</div>
            <div className="text-center">Amount</div>
            <div className="text-center">Status</div>
          </div>
          <div className="mt-3 sm:mt-4 space-y-3">
            {transactionHistory.transactionHistoryArray.length === 0 ? (
              <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-8 text-center">
                <p className="text-gray-400">No transaction history at the moment.</p>
              </div>
            ) : (
              transactionHistory.transactionHistoryArray.map((tx, idx) => (
                <div
                  key={tx._id || idx}
                  className="bg-gradient-to-r from-[#06031E] to-[#0E083C] p-3 sm:p-4 rounded-lg grid grid-cols-4 items-center text-xs sm:text-sm"
                >
                  <div className="text-center">{formatDate(tx.updatedAt)}</div>
                  <div className="text-center">{tx.method.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</div>
                  <div className="text-center">{formatAmount(tx.amount)}</div>
                  <div className="text-center">
                    {tx.status.toLowerCase() === 'pending' ? (
                      <span className="inline-flex items-center justify-center gap-1 sm:gap-2 text-yellow-500 bg-yellow-500/20 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                        <FaClock className="text-yellow-400 text-[10px] sm:text-sm" /> Processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-1 sm:gap-2 text-green-500 bg-green-500/20 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                        <FaCheckCircle className="text-green-400 text-[10px] sm:text-sm" /> Approved
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdrawals;