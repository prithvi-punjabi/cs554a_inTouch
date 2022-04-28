import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
import { makeStyles } from "@material-ui/core";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import { isLoggedIn } from "../helper";

const useStyles = makeStyles({
  container: {
    height: "100vh",
  },
  outerContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  outerContainerUpparLayer: {
    height: "70%",
    background:
      "linear-gradient(90deg, rgba(104,46,177,1) 0%, rgba(39,139,196,1) 64%, rgba(100,198,255,1) 100%)",
  },
  outerContainerInnerLayer: {
    height: "30%",
    background: "#f0f0f0",
  },
  profileCard: {
    position: "absolute",
    borderRadius: "10px",
    background: "white",
    height: "90vh",
    width: "90vw",
    margin: "5vh 5vw",
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
    height: "90vh",
  },
});

const Profile = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, []);
  const classes = useStyles();
  const { userId } = useParams();
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
