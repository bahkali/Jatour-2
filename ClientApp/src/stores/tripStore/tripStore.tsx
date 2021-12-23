import { makeAutoObservable, runInAction } from "mobx";
import agent from "../../api/agent";
import { Trip } from "../../Models/trip";
import { v4 as uuidv4 } from "uuid";
import { store } from "../store";
import { toast } from "react-toastify";
export default class TripStore {
  trips: Trip[] = [];
  tripRegistry = new Map<string, Trip>();
  selectedTrip: Trip | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  /**
   * Bind the Observable in the constructor
   */
  constructor() {
    makeAutoObservable(this);
  }

  private setTrip = (trip: Trip) => {
    trip.startDate = new Date(trip.startDate!);
    trip.endDate = new Date(trip.endDate!);
    this.tripRegistry.set(trip.id, trip);
  };

  // Action Loading trips
  loadTrips = async () => {
    this.setLoadingInitial(true);
    await agent.Trips.list()
      .then((response) => {
        response.forEach((trip) => {
          this.setTrip(trip);
        });
        this.setLoadingInitial(false);
      })
      .catch((error) => {
        console.log(error.response);
      })
      .finally(() => this.setLoadingInitial(false));
  };

  loadTrip = async (id: string) => {
    let trip = this.tripRegistry.get(id);
    if (trip) {
      this.selectedTrip = trip;
    } else {
      this.setLoadingInitial(true);
      await agent.Trips.details(id)
        .then((response) => {
          this.setTrip(response);
          this.selectedTrip = response;
          this.setLoadingInitial(false);
        })
        .catch((error) => {
          console.log(error.response);
        })
        .finally(() => this.setLoadingInitial(false));
    }
  };
  // Action for Loading page
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
  selectTrip = (id: string) => {
    this.selectedTrip = this.trips.find((x) => x.id === id);
    this.selectedTrip = this.tripRegistry.get(id);
  };

  cancelSelectTrip = () => {
    this.selectedTrip = undefined;
  };
  openModalForm = (id?: string) => {
    id ? this.selectTrip(id) : this.cancelSelectTrip();
    this.editMode = true;
  };

  closeModalForm = () => {
    this.editMode = false;
    this.cancelSelectTrip();
    store.modalStore.closeModal();
  };

  /*
    TRIP CRUD OPERATION 
  */
  // Create Trip
  createTrip = async (trip: Trip) => {
    this.loading = true;
    trip.id = uuidv4();
    trip.startDate = new Date(trip.startDate!);
    trip.endDate = new Date(trip.endDate!);
    await agent.Trips.create(trip as Trip)
      .then((res) => {
        runInAction(() => {
          // this.trips.push(trip);
          this.tripRegistry.set(trip.id, trip);
          this.editMode = false;
          this.loading = false;
        });
        toast.success("Trip Added", {
          icon: "🚀",
          position: "bottom-left",
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(`Fail to add trip - ${error.response.data.title}`, {
          icon: "😔",
          position: "bottom-left",
          theme: "colored",
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loading = false;
        });
      });
  };

  // Update Trip
  updateTrip = async (trip: Trip) => {
    this.loading = true;
    await agent.Trips.update(trip as Trip)
      .then((res) => {
        runInAction(() => {
          this.trips = [...this.trips.filter((a) => a.id !== trip.id), trip];
          this.tripRegistry.set(trip.id, trip);
          this.editMode = false;
          this.loading = false;
        });
        toast.success("Trip Updated", {
          icon: "🚀",
          position: "bottom-left",
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Fail to Update trip - ${error.response.data.title}`, {
          icon: "😔",
          position: "bottom-left",
          theme: "colored",
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loading = false;
        });
      });
  };

  // Delete Trip
  deleteTrip = async (id: string) => {
    this.loading = true;
    await agent.Trips.delete(id)
      .then((res) => {
        runInAction(() => {
          this.trips = [...this.trips.filter((a) => a.id !== id)];
          this.tripRegistry.delete(id);
          if (this.selectedTrip?.id === id) this.cancelSelectTrip();
          this.loading = false;
        });
        toast.success("Trip Deleted", {
          icon: "🚀",
          position: "bottom-left",
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Fail to delete trip - ${error.response.data.title}`, {
          icon: "😔",
          position: "bottom-left",
          theme: "colored",
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loading = false;
        });
      });
  };

  //GET By Date Order
  // Issues: StartDate return string
  // Fix
  get tripsByDate() {
    return Array.from(this.tripRegistry.values()).sort(
      (a, b) => a.startDate!.getTime() - b.startDate!.getTime()
    );
  }
}
