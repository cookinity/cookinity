import React from 'react';
import ClassCard from './ClassCard';

export default function CardsOverview({ classes }) {
  let content;

  if (classes.length > 0) {
    content = classes.map((c) => <ClassCard c={c} />);
  } else {
    content = <h3>No classes available</h3>;
  }

  return <div>{content}</div>;
}
