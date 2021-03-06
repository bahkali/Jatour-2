import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { v4 as uuidv4 } from "uuid";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import { TripFormValues } from "../../Models/trip";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles({
  form: {
    padding: 30,
  },
  formItem: {
    marginBottom: 25,
    marginRight: 20,
  },
});

export default observer(function CreateEditTripForm() {
  const history = useHistory();
  const { tripStore, modalStore } = useStore();
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();

  const { closeModalForm, createTrip, updateTrip, loadTrip } = tripStore;

  const [trip, setTrip] = useState<TripFormValues>(new TripFormValues());

  useEffect(() => {
    if (id) loadTrip(id).then((trip) => setTrip(new TripFormValues(trip!)));
  }, [id, loadTrip]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setTrip({ ...trip, [name]: value });
  }

  function handelSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trip.id) {
      trip.id = uuidv4();
      createTrip(trip).then(() => history.push(`/details/${trip.id}`));
    } else {
      updateTrip(trip).then(() => history.push(`/details/${trip.id}`));
    }
    modalStore.closeModal();
  }

  return (
    <>
      <Typography
        variant="h4"
        component="h4"
        gutterBottom
        sx={{ m: 2, textAlign: "center" }}
      >
        Add Trip{" "}
        <span aria-label="img" role="img">
          😉
        </span>
      </Typography>
      <form onSubmit={handelSubmit} className={classes.form} autoComplete="off">
        {/* title */}
        <div className={classes.formItem}>
          <TextField
            id="title"
            label="Title"
            value={trip.title}
            name="title"
            onChange={handleInputChange}
            size="small"
            variant="outlined"
            fullWidth
          />
        </div>
        <Box sx={{ display: "flex" }}>
          {/* startDate: Date; */}
          <div className={classes.formItem}>
            <TextField
              label="Start-Date"
              type="date"
              size="small"
              value={trip.startDate}
              name="startDate"
              onChange={handleInputChange}
              variant="outlined"
              placeholder="2017-05-24"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          {/* endDate: Date; */}
          <div className={classes.formItem}>
            <TextField
              label="End-Date"
              type="date"
              size="small"
              value={trip.endDate}
              name="endDate"
              onChange={handleInputChange}
              variant="outlined"
              placeholder="2017-05-24"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </Box>
        {/* picCoverUrl: string */}
        <div className={classes.formItem}>
          <TextField
            id="picCover"
            label="Cover Picture"
            size="small"
            value={trip.picCoverUrl}
            name="picCoverUrl"
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
        </div>

        <Box sx={{ display: "flex" }}>
          {/* cost: number */}
          <div className={classes.formItem}>
            <TextField
              id="amount"
              size="small"
              variant="outlined"
              value={trip.cost}
              name="cost"
              onChange={handleInputChange}
              placeholder="Cost.."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </div>
          {/* Duration */}
          <div className={classes.formItem}>
            <TextField
              id="duration"
              label="Duration"
              value={trip.duration}
              name="duration"
              onChange={handleInputChange}
              size="small"
              variant="outlined"
            />
          </div>
          {/* rating */}
          <div className={classes.formItem}>
            <TextField
              id="rating"
              label="Rating"
              size="small"
              value={trip.rating}
              name="rating"
              onChange={handleInputChange}
              variant="outlined"
            />
          </div>
        </Box>
        {/* Location */}
        <div className={classes.formItem}>
          <TextField
            id="location"
            label="Location"
            size="small"
            value={trip.location}
            name="location"
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
        </div>
        {/* shortDescription: string; */}
        {/* description: string; */}
        <div className={classes.formItem}>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            variant="outlined"
            value={trip.description}
            name="description"
            onChange={handleInputChange}
            multiline
            rows={4}
            placeholder="Tell your experience..."
            fullWidth
          />
        </div>
        {/* Button */}
        <div className={classes.formItem}>
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            sx={{ mr: 5 }}
          >
            Create
          </Button>
          <Button variant="outlined" onClick={closeModalForm} color="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
});
