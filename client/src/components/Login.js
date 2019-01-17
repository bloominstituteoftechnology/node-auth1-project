import React, { Component } from "react";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import Form, {
  Field,
  FormFooter,
  HelperMessage,
  ErrorMessage,
  ValidMessage
} from "@atlaskit/form";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 400px;
  margin: 0 auto;
  flex-direction: column;
`;

class Login extends Component {
  render() {
    return (
      <Container>
        <Form
          onSubmit={data => {
            console.log("form data", data);
            return axios
              .post("http://localhost:3333/api/login", {
                username: data.username,
                password: data.password
              })
              .then(response => {
                console.log(response.data);
              });
          }}
        >
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Field
                name="username"
                label="User name"
                isRequired
                defaultValue=""
              >
                {({ fieldProps, error }) => (
                  <>
                    <TextField autoComplete="off" {...fieldProps} />
                    {!error && (
                      <HelperMessage>
                        You can use letters, numbers & symbols.
                      </HelperMessage>
                    )}
                    {error && (
                      <ErrorMessage>
                        This user name is already in use, try another one.
                      </ErrorMessage>
                    )}
                  </>
                )}
              </Field>
              <Field
                name="password"
                label="Password"
                defaultValue=""
                isRequired
                validate={value => (value.length < 8 ? "TOO_SHORT" : undefined)}
              >
                {({ fieldProps, error, meta }) => (
                  <>
                    <TextField type="password" {...fieldProps} />
                    {!error && !meta.valid && (
                      <HelperMessage>
                        Use 8 or more characters with a mix of letters, numbers
                        & symbols.
                      </HelperMessage>
                    )}
                    {error && (
                      <ErrorMessage>
                        Password needs to be more than 8 characters.
                      </ErrorMessage>
                    )}
                    {meta.valid && (
                      <ValidMessage>Awesome password!</ValidMessage>
                    )}
                  </>
                )}
              </Field>
              <FormFooter>
                <Button
                  type="submit"
                  appearance="primary"
                  isLoading={submitting}
                >
                  Sign In
                </Button>
              </FormFooter>
            </form>
          )}
        </Form>
      </Container>
    );
  }
}

export default Login;
