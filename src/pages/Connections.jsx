import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Navbar from '../components/Navbar';
import { UserX, User2 } from 'lucide-react';
import { addConnections, removeOneConnection } from '../utils/connectionsSlice';
import PendingRequests from '../components/PendingRequests';

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector(state => state.connections);

  const fetchConnections = async () => {
    if (!connections) {
      try {
        const response = await axios.get(`${BASE_URL}/user/connection`, {
          withCredentials: true
        });
        dispatch(addConnections(response.data.data || []));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    try {
      await axios.delete(`${BASE_URL}/user/connection/${connectionId}`, {
        withCredentials: true
      });
      dispatch(removeOneConnection(connectionId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-rose-200">Loading connections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <img
        src="/feed.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      {/* Darker overlay for better readability */}
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10">
        <div className="px-4 py-3 z-30">
          <Navbar />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Connections Section */}
            <div className="flex-1">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                  Your Connections
                  <span className="text-lg text-rose-300 font-normal">
                    ({connections.length})
                  </span>
                </h2>

                {connections.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-rose-200 text-lg">No connections yet</p>
                    <p className="text-rose-300/60 text-sm mt-2">
                      Start swiping to connect with developers!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connections.map((connection) => (
                      <div 
                        key={connection._id}
                        className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-rose-500/20 transition-colors group"
                      >
                        {/* Profile Picture or Placeholder */}
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                          {connection.photoURL ? (
                            <img 
                              src={connection.photoURL} 
                              alt={`${connection.firstName}'s profile`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User2 className="w-6 h-6 text-rose-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-rose-100 font-semibold truncate">
                            {connection.firstName} {connection.lastName}
                          </h3>
                          <p className="text-rose-300/60 text-sm mt-1 line-clamp-2">
                            {connection.about || "No description available"}
                          </p>
                        </div>

                        <div className="flex-none">
                          <button 
                            onClick={() => handleRemoveConnection(connection._id)}
                            className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 transition-all"
                          >
                            <UserX className="w-5 h-5 text-rose-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Requests Section with clear separation */}
            <div className="lg:w-96">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                    Pending Requests
                  </h2>
                  {/* Added visual indicator for pending requests */}
                  <span className="px-2.5 py-1 bg-rose-500/20 rounded-full text-sm text-rose-300 border border-rose-500/30">
                    New
                  </span>
                </div>
                <div className="divide-y divide-white/10">
                  <PendingRequests />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;