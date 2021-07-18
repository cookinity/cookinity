import React from 'react';
import { Form, Col, InputGroup, Button } from 'react-bootstrap';
import { CITY_CATEGORIES } from '../../constants/CityCategories';
import { CLASS_CATEGORIES } from '../../constants/ClassCategories';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import DatePicker from 'react-multi-date-picker';

const FilterBar = ({
  handleFilterCity,
  handleFilterCategory,
  handleFilterDate,
  startDate,
  fetchClasses,
}) => {
  return (
    <Form>
      {' '}
      <Form.Row>
        <Form.Group as={Col} xs={12} md={{ span: 3, offset: 1 }}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>City</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" custom onChange={handleFilterCity}>
              <option>All Cities</option>
              {CITY_CATEGORIES.map((c) => (
                <option>{c}</option>
              ))}
            </Form.Control>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} xs={12} md="3" controlId="validationCustom02">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Category</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control as="select" custom onChange={handleFilterCategory}>
              <option>All Categories</option>
              {CLASS_CATEGORIES.map((c) => (
                <option>{c}</option>
              ))}
            </Form.Control>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} xs={12} md="3" controlId="validationCustom02">
          <DatePicker
            value={startDate}
            onChange={handleFilterDate}
            type="custom"
            render={(stringDate, openCalendar) => {
              return (
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Date</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    placeholder="All Dates"
                    onClick={openCalendar}
                    value={stringDate}
                  ></Form.Control>
                </InputGroup>
              );
            }}
            plugins={[
              <Toolbar
                position="bottom"
                names={{
                  today: 'select today',
                  deselect: 'select none',
                  close: 'close',
                }}
              />,
            ]}
          />
        </Form.Group>
        <Col xs={12} md={1} className="text-left">
          <Button onClick={fetchClasses}> Search</Button>
        </Col>
      </Form.Row>
    </Form>
  );
};

export default FilterBar;
