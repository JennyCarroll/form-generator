import styled from '@emotion/styled';

const white = '#FFFFFF'

type ButtonProps = {
    color?: string;
    border?: string;
    background?: string;
    isActive?: boolean;
    isUnreadNotifications?: boolean;
    isUnreadMessages?: boolean;
};

const getColor = (arg: string) => {
    switch (arg) {
        case 'purple':
            return '#8353E2FF';

        case 'green':
            return '#1DD75BFF';

        case 'blue':
            return '#00BDD6FF';

        case 'red':
            return '#F22128FF';

        default:
            return white;
    }
};

const getColorHover = (arg: string) => {
    switch (arg) {
        case 'purple':
            return '#723CDEFF';

        case 'green':
            return '#1AC052FF';

        case 'blue':
            return '#00A9C0FF';

        case 'red':
            return '#D20C13FF';

        default:
            return white;
    }
};

const getColorActive = (arg: string) => {
    switch (arg) {
        case 'purple':
            return '#6025D8FF';

        case 'green':
            return '#17A948FF';

        case 'blue':
            return '#0095A9FF';

        case 'red':
            return '#B90B11FF';

        default:
            return white;
    }
};

export const Button = styled.button<ButtonProps>`
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: ${(props) => (props.border ? `1px solid ${getColor(props.border)}` : 'none')};
    border-radius: 3px;
    background: ${(props) =>
        props.isActive && props.color
            ? getColorActive(props.color)
            : props.background
            ? getColorActive(props.background)
            : white};

    color: ${(props) =>
        props.isActive ? white : props.color ? getColor(props.color) : white};
    line-height: 1.2;
    gap: 6px;
    height: 36px;
    letter-spacing: 0.2px;
    padding: ${(props) => (props.isUnreadNotifications ? '0 9px' : '0 12px')};
    font-size: 16px;
    font-weight: 500;
    min-width: 136px

    path {
        fill: ${(props) =>
            props.isActive ? white : props.color ? getColor(props.color) : white};
    }

    :hover {
        color: ${white};
        background: ${(props) =>
            props.color
                ? getColorHover(props.color)
                : props.background
                ? getColorHover(props.background)
                : white};

        path {
            fill: ${white};
        }
    }

    :active {
        color: ${white};
        background: ${(props) =>
            props.color
                ? getColorActive(props.color)
                : props.background
                ? getColorActive(props.background)
                : white};

        path {
            fill: ${white};
        }
    }

    :disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;