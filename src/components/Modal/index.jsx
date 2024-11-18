import Modal from 'react-modal';
import './styles.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function CustomModal({ children, isOpen, onRequestClose, customClassName, maxHeight, minHeight, top, ...props }) {
    const location = useLocation();

    useEffect(() => {
        // Adiciona uma nova entrada no histórico quando o modal abre
        if (isOpen) {
            window.history.pushState(null, '', location.pathname);
            document.body.classList.toggle('stop-scrolling');
        } else {
            document.body.classList.toggle('stop-scrolling');
        }

        const handlePopState = () => {
            if (isOpen) {
                onRequestClose();
            }
        };

        // Escuta o evento "popstate" para capturar o botão de "voltar"
        window.addEventListener('popstate', handlePopState);

        // Remove o listener ao desmontar ou quando o modal fecha
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isOpen, onRequestClose, location.pathname]);

    const style = {
        content: {
            display: "flex",
            flexDirection: "column",
            minHeight: minHeight || "50%",
            maxHeight: maxHeight || "65%",
            width: "100%",
            padding: '10%',
            overflowY: 'auto'
        },
        overlay: {
            alignItems: "end",
            top: top || 0
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            closeTimeoutMS={500}
            ariaHideApp={false}
            shouldCloseOnOverlayClick
            style={props.style || style}
            className={{
                base: `content-${customClassName || 'customModal'}`,
                afterOpen: `content-${customClassName || 'customModal'}--after-open`,
                beforeClose: `content-${customClassName || 'customModal'}--before-close`,
            }}
            overlayClassName={{
                base: `overlay-${customClassName || 'customModal'}`,
                afterOpen: `overlay-${customClassName || 'customModal'}--after-open`,
                beforeClose: `overlay-${customClassName || 'customModal'}--before-close`,
            }}
            {...props}
        >
            {children}
        </Modal>
    );
}
