import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { Check, X, User2 } from 'lucide-react';
import { addRequest, removeRequest } from '../utils/requestSlice';
import { addOneConnection } from '../utils/connectionsSlice'; // Add this import

const PendingRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);  // Provide default empty array
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true
      });
      dispatch(addRequest(response.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      const response = await axios.post(`${BASE_URL}/request/review/${action}/${requestId}`, {}, {
        withCredentials: true
      });
      
      // If request was accepted, add to connections
      if (action === 'accepted' && response.data.success) {
        const request = requests.find(req => req._id === requestId);
        if (request) {
          // Add the user who sent the request to connections
          dispatch(addOneConnection(request.fromUserId));
        }
      }
      
      // Remove from pending requests
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error handling request:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-rose-200">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!requests || requests.length === 0 ? (  // Add null check
        <div className="text-center py-8">
          <p className="text-rose-200/60">No pending requests</p>
        </div>
      ) : (
        requests.map((request) => {
          const { firstName, lastName } = request.fromUserId;
          return (
            <div 
              key={request._id}
              className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-rose-500/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <User2 className="w-5 h-5 text-rose-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-rose-100 font-medium truncate">
                    {firstName} {lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-rose-300/60 text-xs">
                      Wants to connect with you
                    </p>
                    <span className="text-rose-300/40 text-xs">•</span>
                    <time className="text-rose-300/40 text-xs">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRequest(request._id, 'accepted')}
                    className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-colors group"
                    title="Accept Request"
                  >
                    <Check className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleRequest(request._id, 'rejected')}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors group"
                    title="Reject Request"
                  >
                    <X className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PendingRequests;