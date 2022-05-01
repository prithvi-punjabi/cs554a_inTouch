import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import queries from "../queries";
import Swal from "sweetalert2";
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Button, makeStyles } from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import { isLoggedIn } from "../helper";

const useStyles = makeStyles({
  container: {
    height: "70%",
  },
  outerContainer: {
    position: "absolute",
    height: "100%",
    width: "80%",
  },
  outerContainerUpparLayer: {
    height: "80%",
    background:
      "linear-gradient(90deg, rgba(163,38,56,1) 0%, rgba(122,29,43,1) 100%);",
  },
  outerContainerInnerLayer: {
    height: "20%",
    background: "#f0f0f0",
  },
  profileCard: {
    position: "absolute",
    borderRadius: "10px",
    background: "white",
    height: "80%",
    width: "70%",
    margin: "6% 5%",
    boxShadow: "2px 10px 30px grey",
  },
  profilePicture: {
    objectFit: "cover",
    objectPosition: "center",
    width: "40%",
    height: "80%",
    maxHeight: "100%",
    position: "absolute",
    top: "10%",
    borderRadius: "10px",
    left: "5%",
  },
  detailsContainer: {
    padding: "10px 20px",
    textAlign: "left",
    overflowY: "auto",
    height: "90%",
  },
});

const Profile = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);
  const classes = useStyles();
  let userId =
    location.pathname == "/profile"
      ? localStorage.getItem("userId")
      : params.userId;
  const { loading, error, data } = useQuery(queries.user.GET_BY_ID, {
    variables: {
      userId: userId,
    },
    errorPolicy: "all",
    onError: (error) => {
      console.log(error);
    },
  });

  if (data && data.getUser) {
    let user = data.getUser;
    return (
      <div className={classes.container}>
        <div className={classes.outerContainer}>
          <div className={classes.outerContainerUpparLayer}></div>
          <div className={classes.outerContainerInnerLayer}></div>
        </div>
        <div className={classes.profileCard}>
          <Grid container spacing={0} direction="row">
            <Grid item xs={12} sm={12} md={6}>
              <img
                className={classes.profilePicture}
                src={user.profilePicture}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              className={classes.detailsContainer}
            >
              <Typography
                variant="h3"
                component="h3"
                style={{ fontWeight: "bold", padding: "10px 0px" }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="body1"
                component="span"
                style={{ color: "grey" }}
              >
                {user.bio}
              </Typography>
              <Grid container style={{ padding: "10px 0px" }}>
                <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.userName}
                      style={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                </Grid>
                <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                  <ListItemButton>
                    <ListItemIcon>
                      <MailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.email}
                      style={{ textAlign: "left" }}
                    />
                  </ListItemButton>
                </Grid>

                {user.contactNo && (
                  <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.contactNo}
                        style={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  </Grid>
                )}

                {user.contactNo && (
                  <Grid item xs={6} style={{ padding: "0px", width: "70%" }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <CakeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={user.dob}
                        style={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  </Grid>
                )}
              </Grid>

              <Typography
                variant="h6"
                component="span"
                style={{ fontWeight: "bold" }}
              >
                Channels
              </Typography>

              <List>
                {user.courses.map((course) => {
                  return (
                    <ListItem
                      disablePadding
                      style={{ padding: "0px", width: "70%" }}
                    >
                      <ListItemButton>
                        <ListItemText
                          primary={course.code + " " + course.name}
                          style={{ textAlign: "left" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              <Button
                color="primary"
                variant="contained"
                align="center"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  } else if (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: error,
    }).then(() => {
      navigate(-1);
    });
    return <div>Error</div>;
  } else {
    return <div>Loading...</div>;
  }
};

export default Profile;
