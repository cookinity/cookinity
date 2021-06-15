import React from 'react';
import { Form } from 'react-bootstrap';
import { Calendar } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

const DatesSection = ({ bookableDates, setBookableDates, focusedDate, setFocusedDate }) => {
  return (
    <>
      <Form.Group controlId="bookableDates">
        <Form.Label>Choose Dates for Which Your Class Can be Booked</Form.Label>
        <Calendar
          className="mx-auto"
          format="DD/MM/YYYY HH:mm"
          plugins={[
            <DatePanel
              sort="date"
              position="bottom"
              header="Bookable Dates"
              markFocused
              focusedClassName="bg-green"
            />,
            <TimePicker hideSeconds position="right" />,
          ]}
          multiple
          sort
          onFocusedDateChange={setFocusedDate}
          onClose={() => setFocusedDate(undefined)}
          weekStartDayIndex={1}
          value={bookableDates}
          onChange={setBookableDates}
          mapDays={({ date, isSameDate }) => {
            let props = {};

            if (!isSameDate(date, focusedDate)) return;

            props.style = { backgroundColor: 'green' };

            return props;
          }}
        />
      </Form.Group>
    </>
  );
};

export default DatesSection;
