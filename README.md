# **Full Stop** - A Menstruation Tracker for Urbit
**Full Stop** is a menstruation tracker for Urbit. Using **Full Stop**, users can record data, directly to their secure, personal server, about their periods (start, stop, flow, etc.) and sexual activity. Users will have discrete, fully private access to their health data through the **Full Stop** app which will be available on popular mobile phone operating systems.

## Rationale
Access to health care for menstruating people is distributed inequally, geographically. In some countries, access to various reproductive health care procedures is legislatively restricted, or criminalized. Many countries are still involved in internal political struggles to define the contours of access to reproductive health care, and where political favor changes, the People with Periods (e.g. Witches with WAP, Clitizens) in that country are subjected to uncertainty and doubt, not to mention existential dread  resulting from the fact that their body is, as it seems, someone else's choice.

[Recently](https://www.theverge.com/2022/6/30/23190142/delete-period-tracking-app-roe-v-wade-how-to#:~:text=Even%20if%20the%20app%20doesn,request%20to%20delete%20your%20account.), [potential changes to reproductive health care access in the United States](https://www.theguardian.com/world/2022/jun/28/why-us-woman-are-deleting-their-period-tracking-apps) have [led period-havers to delete](https://www.nytimes.com/2022/06/30/technology/period-tracker-privacy-abortion.html) their [digital period trackers from their devices](https://www.houstonchronicle.com/lifestyle/renew-houston/health/article/Period-tracking-apps-spark-panic-after-Roe-v-17279151.php) out of concern that data provided to such apps could be used by State actors to identify pregnancies and, moreover, potential, unexpected terminations of pregnancies, for use in criminal prosecutions (under a theory of abortive health care illegality). 

Period tracking app Flo (no relation to Progressive) has recently announced that it is ["developing a new feature called 'anonymous mode' that will allow users to remove their name, email address, and technical identifiers from their profile"](https://www.npr.org/2022/06/30/1108814577/period-tracker-app-flo-privacy-roe-v-wade). iOS App Store #1 period tracker Stardust (astrology tie-ins) has a privacy policy that explicitly states that it [**will** turn over data to authorities **whether required by law, or not**](https://www.vice.com/en/article/y3pgvg/the-1-period-tracker-on-the-app-store-will-hand-over-data-without-a-warrant).

Even the [EFF has identified that, while it might not be necessary to delete a period tracking app, users should become familiar with the privacy policy of the app and make sure that it aligns with their risk profile](https://www.eff.org/deeplinks/2022/06/should-you-really-delete-your-period-tracking-app). Further, they recommend _considering all apps as a permeable surface through which data about a potential pregnancy could leak_ (suggesting that users should use E2E encrypted messaging, etc, as an additional security measure).

At the risk of sounding flippant, Urbit fixes a great deal of this for users without interrupting their computing experience. Urbit provides an encrypted communication layer with identity primatives (affording identity assurances in comms). Urbit also acts as a personal server, avoiding the concern of corporate leaks of biometric data entirely. And yet, Urbit is available on a user's Phone as an interface for inputting data, maintaining the convenience of otherwise-centralized services. A period tracker on Urbit is simple solution to a very complex problem. It also presents some interesting development questions, reviewed below.

## Overview
**Full Stop** helps you track your period and period-related-accessory-phenomena on a secure, private, personal server called an urbit. **Full Stop** is accessed like a traditional phone application, available on major phone operating systems. **Full Stop** will include basic Push Notifications which will, given the need to pass through Apple's Great Filter, never include private information and should provide no indicia of a user's health conditions (or lack thereof) in their frequency or rate of occurrence.

On first opening **Full Stop**, a user should enter a simple PIN, in addition to their `+code` required to log into their Urbit, generally. This pin provides a final layer of security, on top of their Phone's security, on top of Urbit's encryption and login requirements, as an additional precaution to ensure private access, only.

After establishing their security PIN, **Full Stop** will proceed as with most period tracker applications:

#### Recording Data
* **Period Data:** The user can record information about their period.
    * Start and Stop dates
    * Flow rate per day, during period
    * Spotting during off days
    * Pain and Physical Symptom checklist per day
* **Sexual Activity Data:** The user can record information about any sexual contact they may experience.
    * Date of encounter
    * Use or non-use of additional contraceptive protection (e.g. condoms)
    * User's partner's @p (kidding)
* **Additional BioMarkers:** The user can record period-adjacent data they may wish to record.
    * Off-period spotting
    * Birth Control Pill consumption tracker (possibly alerts, though we're considering the data leak possibilities through push notifications)

#### Reviewing Data
* **Data Visualization:** Visualize period cycles over time, along with predictive models of likely windows of fertility, hormonal activity (based on current medical literature).
* **Orientation Assistance:** Should a user choose, **Full Stop** will assist them in planning sexual encounters to most likely result or not result in a pregnancy
    * **Full Stop** will incorporate several methods of timing contraception users can select from including those proscribed by various women's health organizations as potential alternatives to hormonal or physical birth control options (the 'Rhythm Method', Natural Family Planning, the [Standard Day](https://www.plannedparenthood.org/learn/birth-control/fertility-awareness/whats-standard-days-method#:~:text=To%20use%20the%20Standard%20Days,keep%20track%20of%20their%20cycles.) method).
    * **Full Stop** will also incorporate available ovulation/fertility window timing algorithms users may select from, to assist them in becoming pregnant.

#### Outputting Data
* **U on Urbit:**
    * **U on Urbit** is a Biometric Data Suite for Urbit. Users of **U** will be able to track a wide array of their personal biometric data on their personal server.
    * Rather than attempting to build a comprehensive, monolithic health application, **U** combines many, separate biometric input streams that correspond with the way Users already use other devices/applications to track, e.g. calories, steps, heart rate, recurring medication, insulin levels. Any development team should be able to add a new application or device, whos data **U** should be able to injest.
    * The **U on Urbit** product lineup will begin with **Full Stop**. 


## Research Questions
1. Are Period Trackers "Goal Oriented"?
    * It seems obvious, from an external perspective, that many users of a Period Tracker are, in addition to tracking their general health, tracking their period specifically to identify, promote or inhibit pregnancy as a result of sexual activity.
    * However, varying groups of period-havers may maintain variant beliefs vis-a-vis natalism
          - Does this distinction result in a proliferation of targeted-intent Period Trackers?
          - Are there a cohort of 'help me get pregnant' and a separate cohort of 'do not let me get pregnant' trackers in the market?
          - Could users with strong feelings pro/anti-natalist use an app that asked them to ascribe their intent, being otherwise fully willing to help them with both/either?
          - Should the app just stay out of it?
2. What Does The Literature Say?
    * Medical Literature will likely prescribe an array of good-to-know metadata in addition to basic timing, flow data that most apps track.
    * **Full Stop** should allow, but not require, users to provide comprehensive good-to-know data to their medical professional for review, should they so choose.