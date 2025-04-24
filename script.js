const clock = document.getElementById("clock");
const alarmAudio = document.getElementById("alarm-audio");
const alarmList = document.getElementById("alarm-list");
const alarmStatus = document.getElementById("alarm-status");

let alarms = [];
let activeAlarm = null;
let alarmTimer = null;

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  clock.textContent = time;

  // Check if alarm should ring
  alarms.forEach((alarm, index) => {
    const alarmTime = alarm.time + ":00"; // append seconds for comparison
    if (alarmTime === time && !alarm.rang) {
      triggerAlarm(index);
    }
  });
}

setInterval(updateClock, 1000);

// Set a new alarm
function setAlarm() {
  const timeInput = document.getElementById("alarm-time").value;
  if (!timeInput) {
    alert("Please select a time.");
    return;
  }

  alarms.push({ time: timeInput, rang: false });
  renderAlarms();
}

// Display the alarms
function renderAlarms() {
  alarmList.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${alarm.time}
      <button onclick="deleteAlarm(${index})">❌</button>
    `;
    alarmList.appendChild(li);
  });
}

// Delete an alarm
function deleteAlarm(index) {
  alarms.splice(index, 1);
  renderAlarms();
}

// Trigger the alarm
function triggerAlarm(index) {
  activeAlarm = index;
  alarms[index].rang = true;

  alarmAudio.loop = true;
  alarmAudio.play();

  document.getElementById("snooze-btn").disabled = false;
  document.getElementById("stop-btn").disabled = false;

  alarmStatus.textContent = `⏰ Alarm ringing at ${alarms[index].time}`;

  alarmTimer = setTimeout(() => {
    stopAlarm();
    alarmStatus.textContent = "🕐 Alarm auto-stopped after 1 minute.";
  }, 60000);
}

// Snooze alarm for 5 minutes
function snoozeAlarm() {
  if (activeAlarm !== null) {
    const current = new Date();
    current.setMinutes(current.getMinutes() + 5);
    const snoozedTime = current.toTimeString().slice(0, 5);

    alarms[activeAlarm] = { time: snoozedTime, rang: false };
    renderAlarms();
    stopAlarm();
    alarmStatus.textContent = `🔁 Snoozed for 5 minutes (${snoozedTime})`;
  }
}

// Stop the alarm
function stopAlarm() {
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
  alarmAudio.loop = false;

  if (alarmTimer) clearTimeout(alarmTimer);

  alarmStatus.textContent = "✅ Alarm stopped.";
  document.getElementById("snooze-btn").disabled = true;
  document.getElementById("stop-btn").disabled = true;

  activeAlarm = null;
}
