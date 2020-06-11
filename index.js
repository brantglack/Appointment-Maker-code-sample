import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
const sortBy = require('lodash.sortby');
const uniq = require('lodash.uniq');
const difference = require('lodash.difference');
const toLower = require('lodash.tolower');



export default {

  methods:{
    // Get available Times
    getAvailableAppointmentTimes(){
      this.appointment.time = '';
      var day = moment(this.appointment.date,'YYYY-MM-DD').format('dddd');
      var times = [];

      // If user modified hours on a specific day get array of times hours selected.
      if(this.professional.modifiedHours && this.professional.modifiedHours[this.appointment.date]){
        times = this.getTimesArray([this.professional.modifiedHours[this.appointment.date]])
      } // else create a array of times with normals hours set ...

      // Remove any times that have blocks or appointments already
      if(this.professional.appointments){
        // Remove blocked out times
        if(this.professional.blockedTimes && this.professional.blockedTimes[this.appointment.date]){
          var blockedTimesArray = this.getTimesArray(this.professional.blockedTimes[this.appointment.date]);
          times = difference(times,blockedTimesArray);
        }

        // Remove other unavailable times
        if(this.professional.appointments && this.professional.appointments[this.appointment.date]){
          var AppointmentTimesArray = this.getAppointmentTimesArray(this.professional.appointments[this.appointment.date]);
          times = difference(times,AppointmentTimesArray);
        }

      }


      if(this.professional.modifiedHours && this.professional.modifiedHours[this.appointment.date] && this.professional.modifiedHours[this.appointment.date].out){
        this.appointment.available = []
      }else{
        this.appointment.available = times.length ? uniq(times) : [];
      }

    },

    // Array of Unvailable times
    getAppointmentTimesArray(hours){
      var times = [];

      for(let y in hours){
        var endTime =  moment(hours[y].time,'h:mm A').add(Math.abs(hours[y].service.duration),'minutes').format('h:mm A')
        var time = moment(hours[y].time,'h:mm A').format('h:mm A');
        while (time != endTime){
          times.push(time)
          time = moment(time,'h:mm A').add(15,"minutes").format('h:mm A');
        }
      }

      return times;

    },

    // Create array of available working hours using 24 hour format time strings
    getTimesArray(hours){
      var times = [];

      for(let y in hours){

        var startHour = hours[y].start.A == 'PM' ? Number(hours[y].start.hh) + 12 : Number(hours[y].start.hh);
        var startMinute = hours[y].start.mm;

        var endHour = hours[y].end.A == 'PM' ? Number(hours[y].end.hh) + 12 : Number(hours[y].end.hh);
        var endMinute = hours[y].end.mm;

        var minutes = ['00','15','30','45']

        for (let index = startHour; index <= endHour; index++) {
          var timeOfDay = '';
          if(index < 12){
            timeOfDay = 'AM';
          }else{
            timeOfDay = 'PM';
          }

          for(let x = 0; x < 4; x++){
            var hour = index > 12 ? index - 12 : index;

            if(index == startHour){
              if(Number(minutes[x]) >= Number(startMinute)){
                times.push("${hour}:${minutes[x]} ${timeOfDay}")
              }
            }else if(index == endHour){
              if(Number(minutes[x]) <= Number(endMinute)){
                times.push("${hour}:${minutes[x]} ${timeOfDay}")
              }
            }else{
              times.push("${hour}:${minutes[x]} ${timeOfDay}")
            }

          }
        }
      }

      return times;

    },

    makeAppointment(){
      this.showAppointmentbutton = false;
      this.showSchedule = false;

      // Create object if now appointments have ever been made.
      if(!this.professional.appointments){
        this.professional = {
          appointments: {
            times: {}
          }
        }
      }

      var { date, time, service, message } = this.appointment;

      ...Take destructed variables above and send appointment request to server

    }
  },

}