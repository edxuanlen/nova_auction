import React, { useEffect } from 'react';
import type { StatisticProps } from 'antd';
import { Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';
import { getTVL } from '../utils/contract';
import styled from 'styled-components';

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
);
const TVLShowerWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
`;

const TVLShower: React.FC = () => {

    const [value, setValue] = React.useState(0);
    useEffect(() => {
        const fetchTVL = async () => {
            try {
                const tvl = await getTVL();
                setValue(Number(tvl.toFixed(2)));
            } catch (error) {
                console.log("error: ", error);
            }
        };
        fetchTVL();
    }, []);

    return (
        <TVLShowerWrapper>
            < Statistic title="TVL(ezETH): "
                value={value}
                formatter={formatter}
                prefix="~"
                suffix=" ezETH"
                valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            />
        </TVLShowerWrapper>
    );
};

export default TVLShower;
