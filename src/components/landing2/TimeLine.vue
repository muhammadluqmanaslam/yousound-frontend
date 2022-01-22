<template>
  <section class="timeline-section">
    <div class="inner-timeline">
      <h3 class="section-title">YouSound Partner Program Timeline</h3>

      <div class="timeline">
        <div class="outer">
          <div class="card" v-for="(timeline, i) in timelines" :key="i">
            <div class="timeline-content">
              <h3 class="title">{{ timeline.date }}</h3>
              <p class="subtitle">{{ timeline.title }}</p>
              <p class="content" v-for="(content, n) in timeline.text" :key="n">
                {{ content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "TimeLine",
  data() {
    return {
      timelines: [
        {
          date: "Q1 - 2018",
          title: "Journey to creative sustainability",
          text: [
            `
                YouSound set out to be the best platform for creators to grow
                their audience and sustain their careers using ethical tools
                and transparency built into the platform itself.`,
            `We bootstrapped every aspect of this platform and self
                funded the platform with a network of independent artists,
                creators & entrepreneurs. Since then, we’ve turned down
                millions of dollars from VCs to maintain the trajectory of our
                mission. The first line of code was the start of our journey. `,
          ],
        },
        {
          date: "Q1 - 2021",
          title: "Public Beta",
          text: [
            `While the first official line of code was written in 2018, the idea and road actually started in 2006, we’ve quietly come a long way.`,
            `Launching our app was a huge milestone.  Thousands of people have signed up through word of mouth and we’ve listened to all of the feedback & fine tuned everything to prepare for our public launch in 2022.`,
          ],
        },

        {
          date: "Q2 - 2022",
          title: "Public Launch",
          text: [
            `We did it!  🎉 🎉`,
            `Over 1 million lines of code and years of testing, this launch represents all of our core ideas we initially set out to build.  We are now focusing on finalizing our ad monetization features to have ready for Q4 of 2022.  The hard times might seem behind us, but we’re ready to thug it out as long as we have to.`,
          ],
        },
        {
          date: "Q4 - 2022",
          title: "YouSound Partners Launch",
          text: [
            `We first started this platform solely as a place for artists to buy & sell but over the years streaming became the main way that people consume content.  Streaming has been unfair for most creators, that’s why we’re making sure creators take the lions share of revenue we generate.`,

            `We’ve come up with an innovative way that allow creators to make a liveable income without needing tons of streams. We will provide more info about how we do this later in the year.  In the meantime, join the community and spread the word, the new renaissance is upon us.`,
            `🚀`,
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.timeline-section {
  padding: 130px 0px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  .section-title {
    font-style: normal;
    font-weight: bold;
    line-height: 120%;
    text-align: center;
    color: #000000;
    opacity: 1;
    max-width: 380px;
    text-align: center;
    margin: auto;
    font-size: 28px !important;
    margin-top: 30px;
    margin-bottom: -30px;
  }
  .timeline {
    position: relative;
    max-width: 600px;
    margin: 20px auto;
    padding: 15px;
    margin-top: 85px;
    .outer {
      border-left: 2px solid #bfbfbf;
      .card {
        position: relative;
        margin: 0 0 70px 70px;
        box-shadow: none;
      }
      .timeline-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-right: 30px;
      }
      .title {
        font-weight: bold;
        font-size: 32px !important;
        line-height: 22px !important;
        position: relative;
        font-family: "DM Sans", sans-serif !important;
        transform: translateY(7px);
        &::before {
          content: "";
          position: absolute;
          width: 36px;
          height: 36px;
          left: -88px;
          background: #7bacd9;
          border: 5px solid #ffffff;
          box-sizing: border-box;
          border-radius: 50%;
          top: -5px;
        }
      }

      p.subtitle {
        font-weight: bold;
        font-size: 24px !important;
        line-height: 22px !important;
        margin: 24px 0px !important;
      }
      p.content {
        font-style: normal;
        font-weight: normal;
        font-size: 18px !important;
        line-height: 26px !important;
        max-width: 520px;
      }
    }
  }
}

@media (max-width: 768px) {
  .timeline-section {
    padding: 47px 0px;
    .section-title {
      font-size: 24px !important;
      line-height: 120% !important;
      max-width: 300px;
    }
    .timeline {
      .outer {
        .card {
          margin: 0 0 45px 45px;
        }
        .title {
          font-size: 20px !important;
          line-height: 22px !important;
          transform: translateY(0px);
          &::before {
            width: 25px;
            height: 25px;
            top: -4px;
            left: -58px;
          }
        }
        p.content {
          font-size: 14px;
          line-height: 26px;
        }
        p.subtitle {
          font-size: 18px !important;
          line-height: 22px !important;
          margin: 18px 0px !important;
        }
      }
    }
  }
}
</style>
