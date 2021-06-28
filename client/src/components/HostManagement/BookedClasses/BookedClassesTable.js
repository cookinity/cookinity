
import React from 'react';
import { Table } from 'react-bootstrap';

export const BookedClassesTable = ({ classes, onDeleteCallback }) => {


    const columns = (
        <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Guests</th>
            <th>Duration</th>
            <th>Date</th>
        </tr>
        );

    const rows = classes.map((c) => {
        return (
        <tr key={c.id}>
            <td>{c.title}</td>
            <td>{c.category}</td>
            <td>{c.pricePerPerson} Euro</td>
            <td>3 Guests</td>
            <td>{c.durationInMinutes} Minutes</td>
            <td>{c.durationInMinutes} Minutes</td>
        </tr>
        );
    });

  return (
    <>
      <Table striped bordered hover>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
