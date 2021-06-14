import React from 'react';
import ClassCard from './ClassCard';

export default function CardsOverview(props) {

    const displayClasses = (props) => {
            if (props.length > 0) {
                return (
                    props.map((props) => {
                    return (
                        <ClassCard c={props.class} />
                    )
            })
        )
    } else {
        return (<h3>No classes available</h3>)
    }
}

return(
    <div>{displayClasses(props)}</div>
)

}