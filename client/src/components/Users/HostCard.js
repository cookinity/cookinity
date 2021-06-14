import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import moment from 'moment';

dayjs.extend(utc);
dayjs.extend(localizedFormat);


export default function HostCard({ c }) {
    useEffect(() => {
        runHolder('image-class-name');
    });

    return (
        <Card border="primary" className={"mb-3"}>
            <Card.Img className="image-class-name" variant="top" src={c.avatar} />
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
                            {dayjs(c.createdAt).local().format('MM.DD.YYYY hh:mm a')}
                        </span>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};
