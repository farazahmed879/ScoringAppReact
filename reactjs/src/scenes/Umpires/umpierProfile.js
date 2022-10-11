import { Button, Card, Empty, Icon, PageHeader, Row, Skeleton, Tabs, Tooltip } from 'antd';
import { Stats } from 'fs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import ImageCard from '../../components/ImageCard';
import ProfileHeader from '../../components/ProfileHeader';
import ViewGallery from '../../components/ViewGallery/ViewGallery';
import ViewImage from '../../components/ViewImage';
import ViewMatchBox from '../../components/ViewMatchBox';
import getImage from '../../lib/getImage';
import GalleryService from '../../services/gallery/GalleryService';
import UmpireService from '../../services/Umpire/UmpireService';

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

const UmpireProfile = () => {
  const history = useHistory();
  const [stats, setEventStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);
  const [matchList, setMatchList] = useState([]);
  const [isOpenMatchModal, setIsOpenMatchModal] = useState(false);
  const [gallery, setGAllery] = useState([]);
  const param = useParams();
  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const { TabPane } = Tabs;

  const handleAddMatch = () => {
    setIsOpenMatchModal(true);
  };
  const viewImageModal = (file) => {
    if (Object.keys(file).length) setPreviewImage(file.profileUrl);
    setPreview(true);
  };

  useEffect(() => {
    getUmpireData(param.umpireId);
  }, []);

  const handlePreviewCancel = () => {
    setPreview(!preview);
  };

  const getUmpireData = (id) => {
    setStatsLoading(true);
    UmpireService.getById(id).then((res) => {
      if (res) {
        console.log(res);
        setEventStats(res.result);
        setGAllery(res.result.pictures);
        setStatsLoading(false);
      }
    });
  };

  return (
    <Card>
      <PageHeader onBack={history.goBack} title={'Umpire'} />
      <ProfileHeader data={stats} viewImageModal={viewImageModal} loading={statsLoading}>
        <h1 style={{ color: 'white', marginBottom: '0' }}>Location: {stats.location || 'N/A'}</h1>
      </ProfileHeader>
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
      <ViewImage preview={preview} previewImage={previewImage} handlePreviewCancel={handlePreviewCancel} />
    </Card>
  );
};
export default UmpireProfile;
