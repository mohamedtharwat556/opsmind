import React, { useState } from 'react';
import './RatingComments.css';

export default function RatingComments({ targetId, targetType, onRatingSubmit, onCommentSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      userName: 'ادم فاروق',
      text: 'شكراً على سرعة الحل!',
      timestamp: '2024-01-19T16:05:00Z',
      likes: 3,
      liked: false
    }
  ]);

  const handleRating = (value) => {
    setRating(value);
    onRatingSubmit && onRatingSubmit(value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        userName: 'المستخدم الحالي',
        text: comment,
        timestamp: new Date().toISOString(),
        likes: 0,
        liked: false
      };
      setComments([newComment, ...comments]);
      onCommentSubmit && onCommentSubmit(comment);
      setComment('');
    }
  };

  const toggleLike = (commentId) => {
    setComments(comments.map(c =>
      c.id === commentId
        ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        : c
    ));
  };

  return (
    <div className="rating-comments">
      {/* Rating Section */}
      <div className="rating-section">
        <h4>هل كان هذا مفيداً؟</h4>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="rating-feedback">
            {['', 'سيء', 'متوسط', 'جيد', 'جداً', 'ممتاز'][rating]}
          </p>
        )}
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h4>التعليقات ({comments.length})</h4>

        {/* Add Comment */}
        <div className="comment-input">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="أضف تعليقاً..."
            rows="3"
          />
          <button
            className="submit-comment"
            onClick={handleCommentSubmit}
            disabled={!comment.trim()}
          >
            إرسال التعليق
          </button>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">لا توجد تعليقات حتى الآن</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="comment">
                <div className="comment-header">
                  <div className="user-info">
                    <div className="avatar">
                      {c.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="user-name">{c.userName}</p>
                      <p className="comment-time">{getTimeAgo(c.timestamp)}</p>
                    </div>
                  </div>
                </div>
                <p className="comment-text">{c.text}</p>
                <div className="comment-actions">
                  <button
                    className={`like-btn ${c.liked ? 'liked' : ''}`}
                    onClick={() => toggleLike(c.id)}
                  >
                    👍 {c.likes > 0 && <span>{c.likes}</span>}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes}د`;
  if (hours < 24) return `منذ ${hours}س`;
  if (days < 7) return `منذ ${days}ي`;

  return date.toLocaleDateString('ar-EG');
}
