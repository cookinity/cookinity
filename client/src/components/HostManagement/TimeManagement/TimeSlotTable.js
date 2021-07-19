import { faEdit, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Accordion, Button, Card, Modal, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const TimeSlotTable = ({ c, onDeleteCallback }) => {
  const [show, setShow] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(undefined);

  const columns = (
    <tr>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Duration</th>
      <th>Is Booked</th>
      <th>Actions</th>
    </tr>
  );

  const handleClose = () => setShow(false);
  const handleShow = (ts) => {
    return () => {
      setSelectedSlot(ts);
      setShow(true);
    };
  };

  const rows = c.timeSlots.map((ts) => {
    return (
      <tr key={ts.id} className={dayjs(ts.date).isBefore(dayjs()) ? 'pastTimeSlot' : ''}>
        <td>{dayjs(ts.date).format('llll')}</td>
        <td>{dayjs(ts.date).add(c.durationInMinutes, 'minutes').format('llll')}</td>
        <td>{c.durationInMinutes} Minutes</td>
        <td>{ts.isBooked ? 'Yes' : 'No'}</td>
        <td>
          <Button variant="danger" className="ml-2" onClick={handleShow(ts)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table bordered responsive>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          Do you really want to delete {selectedSlot ? dayjs(selectedSlot.date).format('llll') : ''}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDeleteCallback(selectedSlot)}>
            Delete Time Slot
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
