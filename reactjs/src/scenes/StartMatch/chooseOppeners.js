import React from "react";
import { Card, Col, PageHeader, Row, Steps, Button, Select, Form, Modal, Avatar } from 'antd';
import CustomInput from '../../components/Input';
import getImage from '../../lib/getImage';



const ChooseOppeners = ({ team1AllPlayers = [],
    team2AllPlayers = [],
    team1SelectedPlayers = [],
    team2SelectedPlayers = [],
    startMatchFormik,
    handleChange }
) => {
    return (
        <>
            <Row justify="space-around">
                <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '50px' }} span={12}>
                    <Row gutter={16} className="form-container">
                        <Col span={24}>
                            <Col>
                                <h1 style={{ marginLeft: '275px' }}>striker</h1>
                            </Col>
                            <img
                                style={{ borderRadius: '10px', marginLeft: '200px', height: '175px', width: '200px' }}
                                src={getImage(team1AllPlayers?.find((i) => i.id == startMatchFormik?.values.striker)?.profileUrl)}
                            />
                        </Col>
                        <Col span={24}>
                            <CustomInput
                                style={{ margin: '50px' }}
                                type="select"
                                options={team1AllPlayers.filter((i) =>
                                    team1SelectedPlayers.length > 0 &&
                                    team1SelectedPlayers?.includes(i.id)
                                    && i.id != startMatchFormik.values.nonStriker)}
                                title="Choose Striker"
                                stateKey="striker"
                                handleChange={handleChange}
                                value={startMatchFormik?.values.striker}
                                errorMessage={startMatchFormik.errors.striker}
                            />
                        </Col>

                        <Col span={24}>
                            <Col>
                                <h1 style={{ marginLeft: '275px' }}>bowler</h1>
                            </Col>
                            <img
                                style={{ borderRadius: '10px', marginLeft: '200px', height: '175px', width: '200px' }}
                                src={getImage(team2AllPlayers?.find((i) => i.id == startMatchFormik.values.bowler)?.profileUrl)}
                            />
                        </Col>
                        <Col span={24}>
                            <CustomInput
                                type="select"
                                options={team2AllPlayers?.filter((i) => team2SelectedPlayers.length > 0 && team2SelectedPlayers?.includes(i.id))}
                                title="Choose Bowler"
                                stateKey="bowler"
                                handleChange={handleChange}
                                value={startMatchFormik.values.bowler}
                                errorMessage={startMatchFormik.errors.bowler}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '50px' }} span={12}>
                    <Row gutter={16} className="form-container">
                        <Col>
                            <Col>
                                <h1 style={{ marginLeft: '275px' }}>nonStriker</h1>
                            </Col>
                            <img
                                style={{ borderRadius: '10px', marginLeft: '200px', height: '175px', width: '200px' }}
                                src={getImage(team1AllPlayers.find((i) => i.id == startMatchFormik.values.nonStriker)?.profileUrl)}
                            />
                        </Col>
                        <Col span={24}>
                            <CustomInput
                                type="select"
                                options={team1AllPlayers.filter((i) => team1SelectedPlayers.includes(i.id) && i.id != startMatchFormik.values.striker)}
                                title="Choose Non Striker"
                                stateKey="nonStriker"
                                handleChange={handleChange}
                                value={startMatchFormik.values.nonStriker}
                                errorMessage={startMatchFormik.errors.nonStriker}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default ChooseOppeners;