import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

interface CustomModalProps {
    modalText: string;
}
interface CustomModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    modalText: string;
}

const CustomModal = ({ open, onOk, onCancel, modalText }: CustomModalProps) => {
    return (
        <Modal
            // title=""
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            centered
        >
            <p color='black' style={{ color: 'black', fontSize: '24px' }} >{modalText}</p>
        </Modal>
    );
};

export default CustomModal;
