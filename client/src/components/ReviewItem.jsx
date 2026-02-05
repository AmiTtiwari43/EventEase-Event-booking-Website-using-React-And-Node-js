import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateReview, deleteReview, addReply, deleteReply, toggleLike, toggleDislike, updateReply, toggleReplyLike, toggleReplyDislike } from '../api/reviews';
import ConfirmationModal from './ConfirmationModal';
import Notification from './Notification';

const ReviewItem = ({ review, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [replyComment, setReplyComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyComment, setEditReplyComment] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null });
  const [notification, setNotification] = useState(null);

  const isOwner = user && review.userId && user._id === review.userId._id;
  const isAdmin = user && user.role === 'admin';
  const hasLiked = user && review.likes?.includes(user._id);
  const hasDisliked = user && review.dislikes?.includes(user._id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateReview(review._id, { rating: editRating, comment: editComment });
      setIsEditing(false);
      setNotification({ message: 'Review updated successfully!', type: 'success' });
      onUpdate();
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteConfirm({ open: true, type: 'review', id: review._id });
  };

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.type === 'review') {
        await deleteReview(review._id);
        setNotification({ message: 'Review deleted successfully!', type: 'success' });
      } else {
        await deleteReply(review._id, deleteConfirm.id);
        setNotification({ message: 'Reply deleted successfully!', type: 'success' });
      }
      onUpdate();
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setDeleteConfirm({ open: false, type: null, id: null });
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addReply(review._id, replyComment);
      setReplyComment('');
      setShowReplyForm(false);
      setNotification({ message: 'Reply posted successfully!', type: 'success' });
      onUpdate();
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = (replyId) => {
    setDeleteConfirm({ open: true, type: 'reply', id: replyId });
  };

  const handleLike = async () => {
      if (!user) return setNotification({ message: 'Please login to like', type: 'info' });
      try {
          await toggleLike(review._id);
          onUpdate();
      } catch (error) {
           console.error(error);
      }
  };

  const handleDislike = async () => {
     if (!user) return setNotification({ message: 'Please login to dislike', type: 'info' });
     try {
         await toggleDislike(review._id);
         onUpdate();
     } catch (error) {
         console.error(error);
     }
  };

  const handleReplyLike = async (replyId) => {
    if (!user) return setNotification({ message: 'Please login to like', type: 'info' });
    try {
      await toggleReplyLike(review._id, replyId);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplyDislike = async (replyId) => {
    if (!user) return setNotification({ message: 'Please login to dislike', type: 'info' });
    try {
      await toggleReplyDislike(review._id, replyId);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditingReply = (reply) => {
    setEditingReplyId(reply._id);
    setEditReplyComment(reply.comment);
  };

  const handleUpdateReply = async (replyId) => {
    try {
      setLoading(true);
      await updateReply(review._id, replyId, editReplyComment);
      setEditingReplyId(null);
      setNotification({ message: 'Reply updated successfully!', type: 'success' });
      onUpdate();
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700/50 pb-8 mb-8 last:border-b-0 transition-colors duration-500">
      {/* Header: User Info & Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
            {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20 border border-white/20 dark:border-white/10">
            <span className="text-white font-bold text-lg">
              {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
              {review.userId?.name || 'Anonymous User'}
            </h4>
            <div className='flex items-center gap-2'>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{formatDate(review.createdAt)}</p>
                 {review.updatedAt !== review.createdAt && <span className='text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter'>(edited)</span>}
            </div>
           
          </div>
        </div>

        {/* Rating & Menu */}
        <div className="flex items-center gap-4">
             {/* Stars */}
          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900/30">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < (isEditing ? editRating : review.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} 
                   fill="currentColor" viewBox="0 0 20 20"
                   onClick={() => isEditing && setEditRating(i+1)}
                   style={{cursor: isEditing ? 'pointer' : 'default'}}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-xs font-bold text-yellow-600 dark:text-yellow-500">{review.rating.toFixed(1)}</span>
          </div>
         {/* Edit/Delete for Owner/Admin */}
          {(isOwner) && !isEditing && (
              <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
                  {isOwner && <button onClick={() => setIsEditing(true)} className="text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform">Edit</button>}
                  <button onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform">Delete</button>
              </div>
          )}
       </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-6 animate-fade-in">
             <textarea 
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-4 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 dark:text-white transition-all"
                rows="3"
             />
             <div className="flex gap-3">
                 <button onClick={handleUpdate} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all">
                    {loading ? 'Saving...' : 'Save Changes'}
                 </button>
                 <button onClick={() => setIsEditing(false)} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-xl text-sm font-bold transition-all">Cancel</button>
             </div>
        </div>
     ) : (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 bg-gray-50/50 dark:bg-gray-900/30 p-5 rounded-2xl italic border border-gray-100/50 dark:border-gray-700/30 flex items-start gap-4">
           <span className="text-4xl text-purple-200 dark:text-purple-800/50 leading-none">"</span>
           <span className="mt-2">{review.comment}</span>
        </p>
     )}

      {/* Action Bar (Like, Dislike, Reply) */}
      {/* Action Bar (Like, Dislike, Reply) */}
      <div className="flex items-center gap-6 mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 border-t border-gray-100/50 dark:border-gray-700/50 pt-4">
          <button onClick={handleLike} className={`group flex items-center gap-2 transition-all duration-300 ${hasLiked ? 'text-purple-600 dark:text-purple-400' : 'hover:text-purple-500'}`}>
              <span className={`text-sm ${hasLiked ? 'scale-125' : 'group-hover:scale-125'} transition-transform`}>👍</span>
              <span className="group-hover:translate-x-0.5 transition-transform">Like</span>
              <span className={`bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full ${hasLiked ? 'text-purple-600' : ''}`}>{review.likes?.length || 0}</span>
          </button>
          <button onClick={handleDislike} className={`group flex items-center gap-2 transition-all duration-300 ${hasDisliked ? 'text-rose-500 dark:text-rose-400' : 'hover:text-rose-500'}`}>
              <span className={`text-sm ${hasDisliked ? 'scale-125' : 'group-hover:scale-125'} transition-transform`}>👎</span>
              <span className="group-hover:translate-x-0.5 transition-transform">Dislike</span>
               <span className={`bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full ${hasDisliked ? 'text-rose-500' : ''}`}>{review.dislikes?.length || 0}</span>
          </button>
          {user && (
              <button 
                onClick={() => setShowReplyForm(!showReplyForm)} 
                className={`flex items-center gap-2 transition-all ${showReplyForm ? 'text-emerald-500' : 'hover:text-emerald-500'}`}
              >
                  <span className="text-sm">💬</span>
                  <span>{showReplyForm ? 'Close Reply' : 'Reply'}</span>
              </button>
          )}
      </div>
 
      {/* Reply Form */}
      {showReplyForm && (
          <form onSubmit={handleReply} className="mb-8 pl-6 border-l-4 border-emerald-500/30 animate-slide-in">
              <textarea
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
                placeholder="Share your thoughts on this review..."
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-4 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 dark:text-white shadow-inner transition-all"
                rows="2"
                required
              />
              <div className="flex gap-2">
                   <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all">
                      {loading ? 'Posting...' : 'Post Reply'}
                   </button>
              </div>
          </form>
      )}
 
      {/* Replies List */}
      {review.replies && review.replies.length > 0 && (
          <div className="pl-6 space-y-4 border-l-2 border-gray-100">
              {review.replies.map(reply => {
                  const isReplyOwner = user && reply.userId && user._id === reply.userId._id;
                  const replyHasLiked = user && reply.likes?.includes(user._id);
                  const replyHasDisliked = user && reply.dislikes?.includes(user._id);

                  return (
                  <div key={reply._id} className="bg-gray-100/50 dark:bg-gray-900/50 p-4 rounded-2xl relative group border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                      <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-600 text-xs">
                                {reply.userId?.name ? reply.userId.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                  <p className="font-bold text-xs text-gray-800 dark:text-gray-200">{reply.userId?.name || 'User'}</p>
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">{formatDate(reply.createdAt)}</p>
                              </div>
                          </div>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 scale-90 transition-all">
                                {isReplyOwner && (
                                    <button onClick={() => startEditingReply(reply)} className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-wider hover:underline">Edit</button>
                                )}
                                {(isAdmin || isReplyOwner) && (
                                    <button onClick={() => handleDeleteReply(reply._id)} className="text-rose-500 font-bold text-[10px] uppercase tracking-wider hover:underline">Delete</button>
                                )}
                            </div>
                      </div>
 
                      {editingReplyId === reply._id ? (
                          <div className="mb-3 animate-fade-in">
                              <textarea
                                  value={editReplyComment}
                                  onChange={(e) => setEditReplyComment(e.target.value)}
                                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                  rows="2"
                              />
                              <div className="flex gap-2">
                                  <button onClick={() => handleUpdateReply(reply._id)} disabled={loading} className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md">Save</button>
                                  <button onClick={() => setEditingReplyId(null)} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">Cancel</button>
                              </div>
                          </div>
                      ) : (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed pl-11">{reply.comment}</p>
                      )}
 
                      {/* Reply Actions */}
                      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 border-t border-gray-200/50 dark:border-gray-700/50 pt-3 ml-11">
                          <button onClick={() => handleReplyLike(reply._id)} className={`group flex items-center gap-1.5 transition-all ${replyHasLiked ? 'text-purple-600 dark:text-purple-400' : 'hover:text-purple-500'}`}>
                              <span className={`${replyHasLiked ? 'scale-125' : 'group-hover:scale-125'} transition-transform`}>👍</span>
                              <span>{reply.likes?.length || 0}</span>
                          </button>
                          <button onClick={() => handleReplyDislike(reply._id)} className={`group flex items-center gap-1.5 transition-all ${replyHasDisliked ? 'text-rose-500 dark:text-rose-400' : 'hover:text-rose-500'}`}>
                              <span className={`${replyHasDisliked ? 'scale-125' : 'group-hover:scale-125'} transition-transform`}>👎</span>
                              <span>{reply.dislikes?.length || 0}</span>
                          </button>
                      </div>
                 </div>
                  );
              })}
          </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, id: null })}
        onConfirm={confirmDelete}
        title={deleteConfirm.type === 'review' ? "Delete Review?" : "Delete Reply?"}
        message={`Are you sure you want to delete this ${deleteConfirm.type}? This action cannot be undone.`}
        confirmText={`Delete ${deleteConfirm.type === 'review' ? 'Review' : 'Reply'}`}
        type="danger"
      />

      {/* Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ReviewItem; 