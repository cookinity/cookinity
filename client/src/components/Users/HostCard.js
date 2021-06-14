import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getUsers } from '../../store/features/users/usersActions';
import { CardDeck, Col, Container, Row } from 'react-bootstrap';

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const truncateString = function (str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}


export const HostCard = ({ c }) => {
    useEffect(() => {
        runHolder('image-class-name');
    });


    const shortdescription = c.description ? truncateString(c.description, 200) : '';

    return (
        <Card border="primary" style={{ width: '18rem' }} className={"pull-left mr-3 mb-3"}>
            <Card.Img variant="top" src={c.avatar} />
            <Card.Body>
                <Card.Text>
                    <div>
                        <span className="font-weight-bold">Provider: </span>
                        <span className="info">{c.provider}</span>
                    </div>
                    <div>
                        <span className="font-weight-bold">Role: </span>
                        <span className="info">{c.role}</span>
                    </div>
                    <div>
                        <span className="font-weight-bold">Name: </span>
                        <span className="info">{c.name}</span>
                    </div>
                    <div>
                        <span className="font-weight-bold">Username: </span>
                        <Link to={`/${c.username}`} className="primary" >
                            {c.username}
                        </Link>
                    </div>
                    <div>
                        <span className="font-weight-bold">E-Mail: </span>
                        <span className="info">{c.email}</span>
                    </div>
                    <div>
                        <span className="font-weight-bold">Joined: </span>
                        <span className="info">
                            {moment(c.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                        </span>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};
