import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Tooltip } from 'antd';
import { truncateText } from '../../helper/helper';
import './style.css';

const ViewBracket = ({ formikData }) => {
  console.log('formikData', formikData);
  const [column1Teams, setColumn1Teams] = useState([]);
  const [column2Teams, setColumn2Teams] = useState([]);

  useEffect(() => {
    if (formikData.mockData.length > 0) {
      let bracketTeams = [];
      // formikData.selectedTeams.forEach((element) => {
      //   bracketTeams.push(formikData.mockData.filter((i) => i.key == element));
      // });
      formikData.mockData.forEach((item) => {
        if (formikData.selectedTeams.includes(item.key)) {
          bracketTeams.push(item);
        }
      });
      let col1 = bracketTeams.splice(0, bracketTeams.length / 2);
      console.log('c1', col1);
      console.log('c2', bracketTeams);
      setColumn1Teams(col1);
      setColumn2Teams(bracketTeams);
    }
  }, [formikData]);

  const calculateColumns = (num) => {
    let css = [num];
    let x = num;
    while (x != 1) {
      x = x / 2;
      css.push(x);
    }
    return css;
  };

  const generateBracket = (teams = []) => {
    if (teams.length == 0) return;
    console.log(teams);
    let assignedTeams = JSON.parse(JSON.stringify(teams));
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: calculateColumns(teams.length)
            .map((i) => '1fr')
            .join(' '),
        }}
      >
        {calculateColumns(teams.length).map((i, index) => (
          <div
            style={{
              display: 'grid',
              gridGap: '40px',
              alignItems: 'center',
            }}
          >
            {Array.from(Array(i), (e, index2) => (
              <div>
                <div style={{ display: 'flex' }}>
                  <Tooltip title={index == 0 ? assignedTeams[index2].title : 'Team'}>
                    <Button dir="LTR" style={{ width: index == 0 ? '150px' : '100%' }}>
                      {index == 0 ? truncateText(assignedTeams[index2].title, 10) : 'Team'}
                    </Button>
                  </Tooltip>
                  <hr style={{ width: '30%', marginTop: '15px', marginLeft: '0', marginRight: '0' }} />
                  {i != 1 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                      {Array.from(Array(index + 1), (e, index3) => (
                        <span
                          className="bracketPipes"
                          style={index2 % 2 == 0 ? { marginTop: '10.5px' } : { marginTop: index3 == 0 ? '-3px' : index3 == 1 ? '-50px' : '-85px' }}
                        >
                          |
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  return (
    <Card>
      <Row>
        {Array.from(Array(2), (e, index) => (
          <Col span={12} dir={index == 0 ? 'LTR' : 'RTL'}>
            {generateBracket(index == 0 ? column1Teams : column2Teams)}
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default ViewBracket;
