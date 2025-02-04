import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPen, faRotate, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import YesNo from '../components/YesNo'
import TakeaBreak from '../components/TakeaBreak'
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const ticketsPerPage = 10; // Define tickets per page

  /* useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:3000/tickets');  // Make sure to match your backend API URL
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []); */

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:3000/tickets'); // Replace with your backend API URL
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.assign.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? ticket.category === selectedCategory : true;
    const matchesPriority = selectedPriority ? ticket.priority === selectedPriority : true;

    return matchesSearch && matchesCategory && matchesPriority;
  });


  // Handle delete action
  const handleDeleteClick = (id) => {
    setTicketToDelete(id); // Set the ticket to delete
    setShowModal(true); // Show the modal
  };

  const handleDeleteConfirm = async () => {
    if (ticketToDelete) {
      try {
        const response = await fetch(`http://localhost:3000/tickets/${ticketToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTickets(tickets.filter((ticket) => ticket.id !== ticketToDelete));
          setTicketToDelete(null);
        } else {
          const errorData = await response.json();
          console.error('Error deleting ticket:', errorData.error);
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
    setShowModal(false);
  };

  const handleDeleteSelected = async () => {
    const selectedTickets = tickets.filter(ticket => ticket.checked);
    if (selectedTickets.length === 0) {
      alert("No tickets selected for deletion.");
      return;
    }
  
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedTickets.length} ticket(s)?`);
    if (!confirmDelete) return;
  
    try {
      for (const ticket of selectedTickets) {
        const response = await fetch(`http://localhost:3000/tickets/${ticket.id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          console.error(`Error deleting ticket ${ticket.id}`);
        }
      }
  
      // Remove deleted tickets from state
      setTickets(tickets.filter(ticket => !ticket.checked));
      setSelectedCount(0);
    } catch (error) {
      console.error("Error deleting selected tickets:", error);
    }
  };
  


  const handleDeleteCancel = () => {
    setTicketToDelete(null); // Clear the ticket to delete
    setShowModal(false); // Hide the modal
  };


  const [selectedCount, setSelectedCount] = useState(0);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, checked: !ticket.checked }
          : ticket
      )
    );
  
    const isChecked = tickets.find(ticket => ticket.id === id)?.checked || false;
    setSelectedCount(isChecked ? selectedCount - 1 : selectedCount + 1);
  };
  

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('');  // Deselect category if it's already selected
    } else {
      setSelectedCategory(category);
    }
  };

  const handlePriorityClick = (priority) => {
    if (selectedPriority === priority) {
      setSelectedPriority('');  // Deselect priority if it's already selected
    } else {
      setSelectedPriority(priority);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to calculate expected date by adding 5 days to the created date
  const calculateExpectedDate = (createdDate) => {
    const created = new Date(createdDate);
    created.setDate(created.getDate() + 5);
    return formatDate(created);
  };

  const handleNewTicketClick = () => {
    navigate("/TicketCreate");
  };

  const handleUpdateClick = (ticketId) => {
    navigate(`/TicketUpdate`, { state: { ticketId } });
  };

  const sortedTickets = filteredTickets.sort((a, b) => {
    const idA = parseInt(a.id.split('-')[1], 10);  // Extract and convert the numeric part of the id
    const idB = parseInt(b.id.split('-')[1], 10);  // Extract and convert the numeric part of the id
    return idA - idB;  // Sort in ascending order (T-00001, T-00002, ...)
  });

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleRefresh = () => {
    fetchTickets(); // Refetch tickets
  };

  return (
    <div className="min-h-[90vh] flex text-white">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-gradient-to-b from-[#010518] to-[#0132F9] p-8">
          <button className="bg-white hover:bg-blue-600 text-blue-950 w-[120px] hover:text-white py-2 rounded-2xl mb-4 mx-10" onClick={handleNewTicketClick}><strong>+ New</strong></button>

          <div className="mb-2 mt-[40px]">
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            <ul>
              {['Hardware', 'Software', 'Network', 'Security', 'Access Required'].map((category) => {
                const colors = {
                  Hardware: 'bg-blue-500', // Adjust based on your desired shade
                  Software: 'bg-green-500',
                  Network: 'bg-purple-500',
                  Security: 'bg-red-500',
                  'Access Required': 'bg-pink-500',
                };

                return (
                  <li
                    key={category}
                    className={`relative px-4 py-2 mb-2 text-blue-950 font-semibold text-lg rounded-r-full cursor-pointer ${colors[category]} hover:opacity-80  ${selectedCategory === category}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-4 ${colors[category]} -skew-x-[30deg]`}
                    ></span>
                    <span
                      className={`absolute left-0 bottom-0 h-full w-4 ${colors[category]} -skew-x-[-30deg]`}
                    ></span>
                    <span className="relative">{category}</span>
                  </li>
                );
              })}
            </ul>

          </div>

          <div className='mt-10'>
            <h3 className="text-lg font-semibold mb-2">Priority</h3>
            <ul>
              {['Low', 'Medium', 'High', 'Critical'].map((priority) => {
                const colors = {
                  Low: 'bg-green-500', // Adjust based on your desired shade
                  Medium: 'bg-[#FFFF00]',
                  High: 'bg-orange-500',
                  Critical: 'bg-[#FB0000]',
                };

                return (
                  <li
                    key={priority}
                    className={`relative px-4 py-2 mb-2 text-blue-950 font-semibold text-lg rounded-r-full cursor-pointer ${colors[priority]} hover:opacity-80 ${selectedPriority === priority ? 'opacity-100' : 'opacity-70'}`}
                    onClick={() => handlePriorityClick(priority)}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-4 ${colors[priority]} -skew-x-[30deg]`}
                    ></span>
                    <span
                      className={`absolute left-0 top-0 h-full w-4 ${colors[priority]} -skew-x-[-30deg]`}
                    ></span>
                    <span className="relative">{priority}</span>
                  </li>
                );
              })}
            </ul>

          </div>
        </aside>
      </div>

      <div className="flex-1 relative">
        <header className="bg-white text-black py-4 px-6 flex items-center justify-end pr-[150px]">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border border-none rounded-2xl py-3 px-5 focus:outline-none bg-[#D9FFFF] pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
            <button className="bg-[#010518] hover:bg-[#2c41a7] text-white px-4 py-2 rounded-lg" onClick={handleNewTicketClick}>+ New ticket</button>
            <button onClick={handleDeleteSelected} className="bg-red-700 hover:bg-red-900 text-white px-4 py-2 rounded-lg"disabled={selectedCount === 0}> Delete Selected</button>
            <button className="" ><span className="text-green-600 hover:text-green-700 text-3xl">
                <FontAwesomeIcon icon={faRotate} className='stroke-current stroke-[20]' onClick={handleRefresh} />
              </span></button>
          </div>
        </header>

        {/* Ticket Table */}
        <div className="p-6">
          <table className="min-w-full table-auto text-gray-700">
            <thead className="bg-[#C3D3F5] text-black">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Created(d)</th>
                <th className="px-6 py-3 text-left">Expected(d)</th>
                <th className="px-6 py-3 text-left">Agent</th>
                <th className="px-6 py-3 text-left">Priority</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map(ticket => (
                <tr key={ticket.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-3">{ticket.id}</td>
                  <td className="px-6 py-3">{ticket.status}</td>
                  <td className="px-6 py-3">{ticket.category}</td>
                  <td className="px-6 py-3">{formatDate(ticket.created_at)}</td>
                  <td className="px-6 py-3">{calculateExpectedDate(ticket.created_at)}</td>
                  <td className="px-6 py-3">{ticket.assign}</td>
                  <td className="px-6 py-3">{ticket.priority}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-4">

                      {/* Update Button */}
                      <button
                        onClick={() => handleUpdateClick(ticket.id)}
                        className="text-blue-500 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(ticket.id)}
                        className="text-blue-950 hover:text-[#FB0000]"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={ticket.checked || false}
                        onChange={() => handleCheckboxChange(ticket.id)}
                        className="form-checkbox h-5 w-5 text-blue-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" flex justify-center items-center text-black">{selectedCount} Selected /<span className="text-black ml-1">
              Page {currentPage} of {totalPages}
            </span></div>

        {/* Pagination Controls */}
        {/*  <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-black">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div> */}


        {showModal && (
          <YesNo
            message="Are you sure you want to delete this ticket?"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}

        {/* Footer */}
        <footer>
          <div className="flex justify-between items-center px-4">
            {/* <div className="text-black">{selectedCount} Selected</div> */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-[#010518] text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              Previous
            </button>
            <TakeaBreak />
            {/* <button className="bg-[#010518] text-white px-4 py-2 rounded-lg">
              Next
            </button> */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-[#010518]  text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default DashBoard;
