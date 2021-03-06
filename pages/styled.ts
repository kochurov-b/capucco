import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 60px;
  background: #FFFFFF;
`;

export const Wrapper = styled.div`
  width: 1132px;

  @media only screen and (max-width: 1145px) {
    width: calc(100% - 20px);
  }
`;
