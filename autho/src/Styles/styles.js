import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  line-height: 5px;
  font-size: 15px;

  h2 {
    font-size: 10px;
  }
`;
export const FormGroup = styled.form`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  top: 170px;
  right: 800px;
  line-height: 15px;
  padding: 40px;
  width: 300px;
  height: 250px;
  z-index: 2;
  background:darkgray;
  box-shadow: 0px 0px 15px 0px rgb(120, 120, 120);
  input {
    height: 25px;
    padding: 10px 10px;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  button {
    margin-top: 30px;
  }
`;

export const Navigation = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  width: 300px;
  line-height: 10px;
  align-content: center;
  margin-top: 100px;
  .nav-link {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    text-decoration: none;
    padding: 5px 22px;
    font-size: 20px;
    width: 150px;
    height: 30px;
    border: none;
    background-color: rgb(235, 70,6);
    color: black;
  }
`;

export const UserCard = styled.div`

display: flex;
justify-content:center;
`
