
import React, { useState, useEffect } from "react";
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import genderConst from '../../lib/genderConst';
import { playingRoleOptions } from '../../components/Enum/enum';
import getImage from '../../lib/getImage';
import playerService from '../../services/player/playerService';
import { useParams } from 'react-router-dom';
import ChooseOppeners from './chooseOppeners';


const NewInning = () => {

    const [team1AllPlayers, setTeam1AllPlayers] = useState([]);
    const [team2AllPlayers, setTeam2AllPlayers] = useState([]);
    const [team1SelectedPlayers, setTeam1SelectedPlayers] = useState([]);
    const [team2SelectedPlayers, setTeam2SelectedPlayers] = useState([]);
    const [initLoading, setInitLoading] = useState([]);

    const param = useParams();
    useEffect(() => {
        getAllPlayerByTeamId(param.team1Id);
        getAllPlayerByTeamId(param.team2Id);
    }, []);

    const startMatchInitial = {
        striker: '',
        nonStriker: '',
        bowler: '',
    };
    const startMatchValidation = Yup.object().shape({
        striker: Yup.string().required('Required'),
        nonStriker: Yup.string().required('Required'),
        bowler: Yup.string().required('Required'),
    });

    const handleSubmit = () => {
        console.log("")
        // matchService.startMatch(model).then((res) => {
        //     res.success
        //         ? history.push(
        //             '/liveScoring/team1/' + param.team1Id + '/' + param.team1 + '/team2/' + param.team2Id + '/' + param.team2 + '/match/' + param.matchId
        //         )
        //         : error({ title: res.successMessage });
        //     setIsLoading(false);
        // });
    };

    const startMatchFormik = useFormik({
        enableReinitialize: true,
        initialValues: startMatchInitial,
        validationSchema: startMatchValidation,
        onSubmit: handleSubmit,
    });

    const handleChange = (value, key) => {
        startMatchFormik.setValues({ ...startMatchFormik.values, [key]: value });
    };

    const getAllPlayerByTeamId = (id) => {
        setInitLoading(true);
        playerService.getAllByTeamId(id).then((res) => {
            console.log('Team Player', res);

            // let array = [];
            // res.forEach((el, index) => {
            //     let ob = {
            //         id: el.id,
            //         email: el.email || 'N/A',
            //         gender: el.gender == genderConst.female ? 'Female' : el.gender == genderConst.male ? 'Male' : 'N/A',
            //         playerRole: playingRoleOptions.find((i) => i.id == el.playerRoleId)?.name || 'N/A',
            //         checked: false,
            //         name: {
            //             title: el.name,
            //             first: el.name.split(' ')[0],
            //             last: el.name.split(' ')[1],
            //         },
            //         nat: 'RS',
            //         picture: {
            //             large: getImage(el.profileUrl),
            //             medium: getImage(el.profileUrl),
            //             thumbnail: getImage(el.profileUrl),
            //         },
            //     };
            //     array.push(ob);
            // });
            setInitLoading(false);
            if (id == param.team1Id) {
                // setTeam1List(array);
                setTeam1AllPlayers(res);
            }
            if (id == param.team2Id) {
                // setTeam2List(array);
                setTeam2AllPlayers(res);
            }
        });
    };


    return <ChooseOppeners
        team1AllPlayers={team1AllPlayers}
        team1SelectedPlayers={team1SelectedPlayers}
        startMatchFormik={startMatchFormik}
        handleChange={handleChange}
        team2AllPlayers={team2AllPlayers}
        team2SelectedPlayers={team2SelectedPlayers} />

}

export default NewInning;