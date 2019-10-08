const data = {
    years: {
        elem: null,
        value: null
    },
    months: {
        elem: null,
        value: null
    },
    weeks: {
        elem: null,
        value: null
    },
    days: {
        elem: null,
        value: null
    },
    hours: {
        elem: null,
        valıue: null
    },
    minutes: {
        elem: null,
        value: null
    },
    seconds: {
        elem: null,
        value: null
    },
    savings: null,
    dailyCost: 18,
    time: 1569484800000 // new Date(2019, 8, 26, 11).getTime()
};

const progresses = document.querySelectorAll(".stats__progress[fraction]");

update();

  function update() {
    const now = new Date().getTime();
    const seconds = (now - data.time) / 1000;
    data.years = seconds / 31556952;
    data.months = seconds / 2592000;
    data.weeks = seconds / 604800;
    data.days = seconds / 86400;
    data.hours = seconds / 3600;
    data.minutes = seconds / 60;
    data.seconds = seconds;
    data.savings = Math.floor(data.days * data.dailyCost)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    updatePies();
    document.getElementById("js-savings").innerText = data.savings;
  
    requestAnimationFrame(update);
  }
  
  function updatePies() {
    const radius = 25;
    const circumference = radius * 2 * Math.PI;
    progresses.forEach(progress => {
      const value = data[progress.getAttribute("fraction")];
      const complete = Math.floor(value);
      let v = complete.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (complete < 10) v = value.toFixed(2);
      if (complete < 1) v = value.toFixed(3);
      progress.querySelector("h2").innerText = v;
      const percent = Math.round((value - complete) * 100 * 10) / 10;
      const offset = circumference - (percent / 100) * circumference;
      progress.querySelector(
        ".left"
      ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 100 100">
      <circle class="bg" r="${radius}" cx="50" cy="50" />
      <circle
        class="prog"
        r="${radius}"
        cx="50"
        cy="50"
        stroke-dasharray="${circumference} ${circumference}"
        stroke-dashoffset="${offset}"
      />
    </svg>`;
    });
  }
  