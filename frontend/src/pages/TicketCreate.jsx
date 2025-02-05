import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import TakeaBreak from '../components/TakeaBreak';
import { useNavigate } from 'react-router-dom';

const TicketCreate = () => {

  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assign, setAssign] = useState('');
  const [requester, setRequester] = useState('');
  const navigate = useNavigate();
 

  useEffect(() => {
      const fetchComments = async () => {
        try {
          const response = await fetch('https://ticketia-backend.onrender.com/comments');
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
  
      fetchComments();
    }, []); // Empty dependency array means this effect runs only once when the component mounts
    

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log('Submitting comment:', newComment); // Add this line for debugging
      try {
        const response = await fetch('https://ticketia-backend.onrender.com/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: newComment,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Fetch updated comments after posting
          const updatedResponse = await fetch('https://ticketia-backend.onrender.com/comments');
          const updatedData = await updatedResponse.json();
          setComments(updatedData);
        } else {
          console.error('Failed to add comment:', data);
          alert(`Failed to add comment: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to add comment');
      }
      setNewComment('');
    }
  };
  
  const categoryColors = {
    Hardware: "bg-[#C3D3F5]",
    Software: "bg-[#C3F5C5]",
    Network: "bg-[#F1C3F5]",
    Security: "bg-[#FF9393]",
    "Access Required": "bg-[#F569FD]",
  };

  const priorityColors = {
    Low: "bg-[#41B005]",
    Medium: "bg-[#FFFF00]",
    High: "bg-[#FFA500]",
    "Critical": "bg-[#FB0000]",
  };


  /* const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  }; */

  const handleCancel = () => {
    setNewComment("");
    setEditingIndex(null);
    setEditingComment("");
  };

  const handleEditClick = (id) => {
    setEditingIndex(id);
    const commentToEdit = comments.find(comment => comment.id === id);
    setEditingComment(commentToEdit.comment); // Set the content to edit
  };
  
  
  const handleEditSubmit = async (e, id) => {
    e.preventDefault(); // Prevent form submission
    
    if (!editingComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }
  
    try {
      const response = await fetch(`https://ticketia-backend.onrender.com/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: editingComment }),
      });
  
      if (response.ok) {
        const updatedComments = comments.map((comment) =>
          comment.id === id ? { ...comment, comment: editingComment } : comment
        );
        setComments(updatedComments);
        setEditingIndex(null); // Reset editing index
        setEditingComment(""); // Reset editing comment
      } else {
        console.error('Failed to update comment');
        alert('Failed to update comment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update comment');
    }
  };
  
  
  
  
  const handleDeleteClick = async (id) => {
    console.log('Deleting comment with id:', id); // Check that id is defined
    try {
      const response = await fetch(`https://ticketia-backend.onrender.com/comments/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Comment deleted successfully');
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to delete comment:', errorData.error);
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };
  

  const handleCreateSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    if (title && description) {
      try {
        const response = await fetch('https://ticketia-backend.onrender.com/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            category,
            assign,
            priority,
            requester,
            comments: comments.filter(comment => !comment.ticket_id) // Only include comments without a ticket ID
              .map(comment => ({ id: comment.id, text: comment.comment })),
          }),
        });
      
        if (response.ok) {
          const createdTicket = await response.json();
          alert(`Ticket created successfully! ID: ${createdTicket.id}`);
      
          // Update comments only for this ticket
          const updateCommentPromises = comments
            .filter(comment => !comment.ticket_id) // Only update comments without a ticket ID
            .map(comment =>
              fetch(`https://ticketia-backend.onrender.com/comments/${comment.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ticket_id: createdTicket.id }),
              })
            );
          await Promise.all(updateCommentPromises);
      
          // Reset form fields
          setTitle('');
          setDescription('');
          setCategory('');
          setAssign('');
          setPriority('');
          setRequester('');
          setComments([]); // Clear comments state
        } else {
          alert('Failed to create ticket');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create ticket.');
      }
    } else {
      alert("Please fill out the necessary fields.");
    }
  };
  
  const handleReturnToDash = () => {
    navigate("/DashBoard");
  };

  
  
  return (
    <div className='flex flex-col justify-center'>
      <div className="flex items-center justify-center min-h-[610px] py-10">
        <div className="bg-[#EEFAFD] shadow-md rounded-lg p-6 w-full max-w-[935px] h-auto relative">
          <button className="absolute top-4 right-4 text-2xl text-black hover:text-gray-500" onClick={handleReturnToDash}><FontAwesomeIcon icon={faCircleXmark} /></button>
          <form className="space-y-4 mt-7" onSubmit={handleCreateSubmit}>
            <div className='flex gap-x-[80px]'>
              <div>
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="w-[360px]  rounded-md p-2 bg-[#85FEE2] focus:ring focus:ring-blue-200 focus:outline-none"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='pt-8'>
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-[360px]  rounded-md p-2 bg-[#85FEE2] focus:ring focus:ring-blue-200 focus:outline-none h-60"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="comments" className="block text-gray-700 font-medium mb-1">
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    className="w-full border rounded-md p-2  bg-[#85FEE2] focus:ring focus:ring-blue-200 focus:outline-none h-12"
                    placeholder="Comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}>
                  </textarea>
                  <div className="flex pt-5">
                    <button
                      type="button"
                      className="bg-[#041569] text-white rounded-2xl px-5 py-2 hover:bg-blue-800" onClick={handleCommentSubmit}>Comment
                    </button>
                    <button
                      type="button"
                      className="text-[#041569] hover:underline ml-auto " onClick={handleCancel}>Cancel
                    </button>
                  </div>
                </div>
                
                <div className="mt-5">
                  <h3 className="text-gray-700 font-semibold mb-2">All Comments:</h3>
                  <div className='max-h-[180px] overflow-y-auto'>
                    <ul className="space-y-3">
                    {comments
                      .filter((comment) => !comment.ticket_id) // Only include comments without a ticket_id
                      .map((comment) => (
                        <li
                          key={comment.id}
                          className="p-3 border rounded-md bg-gray-50 flex justify-between items-center"
                        >
                          {editingIndex === comment.id ? (
                            <textarea
                              value={editingComment}
                              onChange={(e) => setEditingComment(e.target.value)}
                              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                          ) : (
                            <span>{comment.comment}</span>
                          )}
                          <div className="ml-3 flex space-x-2">
                            {editingIndex === comment.id ? (
                              <>
                                <button
                                  type="button"
                                  className="text-green-600 hover:underline"
                                  onClick={(e) => handleEditSubmit(e, comment.id )}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-red-600 hover:underline"
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="text-blue-500 hover:text-blue-800"
                                  onClick={() => handleEditClick(comment.id )}
                                >
                                  <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button
                                  type="button"
                                  className="text-blue-950 hover:text-[#FB0000]"
                                  onClick={() => handleDeleteClick(comment.id )}
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
              <div className="flex flex-col gap-4 ">
                <select className={`w-full p-2 rounded-md text-black ${
                    categoryColors[category] || "bg-gray-200"
                  } hover:opacity-80  outline-none`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)} // Update state on selection
                  style={{ border: "none" }}
                >
                  <option>Category</option>
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Network</option>
                  <option>Security</option>
                  <option>Access Required</option>
                </select>
                <select className="border rounded-md p-2 bg-[#721FD8] text-white focus:ring focus:ring-blue-200 focus:outline-none"
                 value={assign}
                 onChange={(e) => setAssign(e.target.value)}> // Update state on selection
                  <option>Assign</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Evelyn Hartman</option>
                  <option>Liam Prescott</option>
                  <option>Maya Donovan</option>
                  <option>Kim Brown</option>
                </select>
                <select className={`w-full p-2 rounded-md text-black ${
                    priorityColors[priority] || "bg-gray-200"
                  } hover:opacity-80  outline-none`}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)} // Update state on selection
                  style={{ border: "none" }}>
                  <option>Priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <select className="border rounded-md p-2 text-white bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}> // Update state on selection
                  <option>Requester</option>
                  <option>Tim</option>
                  <option>Rita</option>
                  <option>Cindy</option>
                  <option>Ron</option>
                  <option>Ben</option>
                  <option>Mike</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="bg-[#041569] text-white rounded-2xl px-6 py-2 hover:bg-blue-800"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className='flex justify-center my-5'>
        <TakeaBreak/>
      </footer>
    </div>
  );
};


export default TicketCreate