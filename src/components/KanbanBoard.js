import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    axios.get(API_ENDPOINT)
      .then(response => {
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const groupAndSortTickets = () => {
    let groupedTickets;

    if (groupingOption === 'status') {
      groupedTickets = groupByStatus(tickets);
    } else if (groupingOption === 'user') {
      groupedTickets = groupByUser(tickets);
    } else {
      groupedTickets = groupByPriority(tickets);
    }

    const sortedTickets = sortBy === 'priority'
      ? sortByPriority(groupedTickets)
      : sortByTitle(groupedTickets);

    return sortedTickets;
  };

  const groupByStatus = (tickets) => {
    const grouped = tickets.reduce((acc, ticket) => {
      const status = ticket.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(ticket);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, tickets]) => ({ name, tickets }));
  };

  const groupByUser = (tickets) => {
    const grouped = tickets.reduce((acc, ticket) => {
      const user = users.find(u => u.id === ticket.userId);
      const userName = user ? user.name : 'Unassigned';
      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(ticket);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, tickets]) => ({ name, tickets }));
  };

  const groupByPriority = (tickets) => {
    const grouped = tickets.reduce((acc, ticket) => {
      const priority = ticket.priority;
      if (!acc[priority]) {
        acc[priority] = [];
      }
      acc[priority].push(ticket);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, tickets]) => ({ name, tickets }));
  };

  const sortByPriority = (tickets) => {
    return tickets.sort((a, b) => b.name - a.name);
  };

  const sortByTitle = (tickets) => {
    return tickets.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
  };

  return (
    <div className="container">
      <div className="dropdown-container">
        <label htmlFor="grouping">Group By:</label>
        <select id="grouping" onChange={(e) => handleGroupingChange(e.target.value)} value={groupingOption}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>

        <label htmlFor="sorting">Sort By:</label>
        <select id="sorting" onChange={(e) => handleSortChange(e.target.value)} value={sortBy}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        {/* <button className="button" onClick={() => setTickets(groupAndSortTickets())}>Display</button> */}
      </div>

      <div className="board">
        {groupAndSortTickets().map((group, index) => (
          <div className="column" key={index}>
            <h3>{group.name}</h3>
            <ul>
              {group.tickets.map((ticket) => (
                <li key={ticket.id}>
                  <div className="card">
                    <strong>{ticket.title}</strong>
                    <p>Status: {ticket.status}</p>
                    <p>User: {users.find(u => u.id === ticket.userId)?.name || 'Unassigned'}</p>
                    <p className="priority">Priority: {ticket.priority}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};




export default KanbanBoard;
