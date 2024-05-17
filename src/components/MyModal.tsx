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
            title="Modal"
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText="确认"
            cancelText="取消"
        >
            <p color='black'>{modalText}</p>
        </Modal>
    );
};

export default CustomModal;
