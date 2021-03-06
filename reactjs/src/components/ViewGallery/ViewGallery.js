import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Tooltip, Skeleton } from 'antd';
import AppConsts from '../../lib/appconst';
import { truncateText } from '../../helper/helper';
import getImage from '../../lib/getImage';

const ViewGallery = ({ data = [] }) => {
    return (
        <>
            <Card>
                {data.map((e, index2) => (
                    <Card.Grid style={{ width: '20%', padding: '10px' }}>
                        <Card cover={<img alt="example" src={getImage(e.url)} />} bodyStyle={{ padding: 0 }}>
                        </Card>
                    </Card.Grid>
                ))}
            </Card>
        </>
    )
}
export default ViewGallery;