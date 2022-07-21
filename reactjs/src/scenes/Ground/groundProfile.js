import { Button, Card, Empty, Icon, PageHeader, Row, Skeleton, Tabs, Tooltip } from "antd";
import { Stats } from "fs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ViewGallery from "../../components/ViewGallery/ViewGallery";
import ViewMatchBox from "../../components/ViewMatchBox";
import getImage from "../../lib/getImage";
import GalleryService from "../../services/gallery/GalleryService";

const gridStyle = {
    width: '20%',
    textAlign: 'center',
    margin: '10px',
    cursor: 'pointer',
};
const filterButon = {
    position: 'fixed',
    right: '32px',
    bottom: '102px',
    Zindex: '2147483640',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
};

const GroupProfile = () => {
    const history = useHistory();
    const [stats, setEventStats] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);
    const [matchList, setMatchList] = useState([]);
    const [isOpenMatchModal, setIsOpenMatchModal] = useState(false);
    const [gallery, setGAllery] = useState([]);
    const param = useParams();
    const { TabPane } = Tabs;

    const handleAddMatch = () => {
        setIsOpenMatchModal(true);
    };
    useEffect(() => {
        getGallery(param.groundId);
    }, []);

    const getGallery = (id) => {
        GalleryService.getAllByEntity(undefined, undefined, undefined, undefined, id).then((res) => {
            console.log('Gallery', res);
            if (res.success) {
                setGAllery(res.result);
            }
        });
    };
    return <Card>
        <PageHeader
            onBack={history.goBack}
            title={"Grpound"}
        />
        <div>
            <Card
                hoverable
                style={{ width: '100%', height: '200%', marginBottom: '-220px' }}
                cover={<img alt="example" src={getImage(stats.profileUrl)} height={500} width={150} />}
            ></Card>
            <Row style={{ marginLeft: '20px', marginTop: '50px', display: 'flex' }}>
                <Card
                    hoverable
                    style={{ width: '150px', height: '150px' }}
                    cover={<img alt="example" src={getImage(stats.profileUrl)} height={150} width={150} />}
                ></Card>
                <Skeleton loading={statsLoading}>
                    <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                        <h1 style={{ color: 'white', fontSize: '33px', marginBottom: '0' }}>Name: {stats.event}</h1>
                        <h1 style={{ color: 'white', marginBottom: '0' }}>Organizor: {stats.organizor || 'N/A'}</h1>
                        <h1 style={{ color: 'white', marginBottom: '0' }}>
                            {moment(stats.startDate).format('MM/DD/YYYY') || 'N/A'} to {moment(stats.endDate).format('MM/DD/YYYY') || 'N/A'}
                        </h1>
                        <h1 style={{ color: 'white', marginTop: '-5px' }}>{stats.type == 1 ? 'Knock-out' : stats.type == 2 ? 'League Based' : ''}</h1>
                    </div>
                </Skeleton>
            </Row>
            <Tabs defaultActiveKey="1" style={{ marginTop: '50px' }}>
                <TabPane
                    tab={
                        <span>
                            <Icon type="apple" />
                            Stats
                        </span>
                    }
                    key="1"
                ></TabPane>
                <TabPane
                    tab={
                        <span>
                            <Icon type="apple" />
                            Gallery
                        </span>
                    }
                    key="2"
                >
                    <ViewGallery data={gallery}></ViewGallery>
                </TabPane>
            </Tabs>
        </div>
    </Card >
}
export default GroupProfile;