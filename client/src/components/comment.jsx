import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Comments = ({ listingId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/${listingId}`);
        const data = await res.json();

         // Fetch user information for each comment
      const commentsWithUserInfo = await Promise.all(
        data.map(async (comment) => {
          const userRes = await fetch(`/api/user/${comment.userRef}`);
          const userInfo = await userRes.json();
          return { ...comment, userInfo };
        })
      );

      setComments(commentsWithUserInfo);
        console.log(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [listingId]);


  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      try {
        const response = await fetch('/api/comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            listingID: listingId, 
            comment: comment,
            userRef: currentUser._id, }),
        });

        if (response.ok) {
          const newComment = await response.json();
          setComments([...comments, newComment]);
          setComment('');
        } else {
          console.error('Failed to submit comment');
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div>
  {comments.map((comment, index) => (
    <div key={index} className="bg-gray-100 p-4 rounded-md mb-2">
      <div className="flex items-center mb-2">
        <img
          src={comment.userInfo.avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">{comment.userInfo.username}</span>
      </div>
      <p>{comment.comment}</p>
    </div>
  ))}
</div>
      <form onSubmit={handleSubmitComment} className="flex mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleCommentChange}
          className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      
    </div>
  );
};

export default Comments;