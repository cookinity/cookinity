import React from 'react';
import { Form, Col, InputGroup, Button } from 'react-bootstrap';
import { CITY_CATEGORIES } from '../../constants/CityCategories';
import { CLASS_CATEGORIES } from '../../constants/ClassCategories';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import DatePicker from 'react-multi-date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterBar = ({
  handleFilterCity,
  handleFilterCategory,
  handleFilterDate,
  startDate,
  fetchClasses,
}) => {
  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="card border-light">
              <div className="card-body">
                <Form>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      xs={12}
                      md={{ span: 3, offset: 1 }}
                      className="my-auto filterOrder"
                    >
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon="map-marker" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control as="select" custom onChange={handleFilterCity}>
                          <option>All Cities</option>
                          {CITY_CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </Form.Control>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md="3" className="my-auto">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon="hamburger" />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control as="select" custom onChange={handleFilterCategory}>
                          <option>All Categories</option>
                          {CLASS_CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </Form.Control>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md="3" className="my-auto filterOrder">
                      <DatePicker
                        // make no date in the past selectable
                        minDate={new Date()}
                        value={startDate}
                        onChange={handleFilterDate}
                        type="custom"
                        render={(stringDate, openCalendar) => {
                          return (
                            <InputGroup>
                              <InputGroup.Prepend>
                                <InputGroup.Text>
                                  <FontAwesomeIcon icon="calendar" />
                                </InputGroup.Text>
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
                    <Col xs={12} md={1} className=" filterOrder">
                      <Button onClick={fetchClasses}> Search</Button>
                    </Col>
                  </Form.Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
