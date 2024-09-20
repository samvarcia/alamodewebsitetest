"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";
import { useState } from "react";
import Form from "../components/Form";

export default function Page() {
    
  return (
    <motion.main className={styles.checkin}>
        <motion.section className={styles.checkinHero}
        animate={{
          background:["radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(112, 0, 22, 1) 100%), #000",
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.57) 30.62%, #700014 52.24%), #000", 
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(112, 0, 22, 1) 100%), #000",]
        }}
        transition={{ ease: "easeInOut", duration: 5 }}
        >
              <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.confirmation}
    >
        <Link href="/">
            <Image 
            src="/logoalamode.svg"
            width={280}
            height={150}
            priority
            className={styles.logo}
            />
        </Link>
        <h1>à la mode Terms and Conditions</h1>
    
    <p>Welcome to the à la mode! By purchasing tickets, donating, attending, or participating in any of our events, you agree to the following terms and conditions. Please read them carefully.</p>
    
    <h2>1. Code of Conduct</h2>
    <ul>
        <li>à la mode is committed to creating a safe, inclusive, and enjoyable environment for all participants. Harassment, discrimination, or inappropriate behavior of any kind will not be tolerated.</li>
        <li>The organizers reserve the right to refuse entry or remove any attendee whose behaviour is deemed inappropriate, without explanation.</li>
    </ul>

    <h2>2. Eligibility for Attendance</h2>
    <ul>
        <li>à la mode events are exclusive to professional high-fashion models. You may be asked to provide proof of affiliation upon entry.</li>
        <li>Attendees must be 18 years or older unless otherwise stated in the event details. Valid government-issued identification will be required at the entrance.</li>
        <li>Entry to the event will only be granted with valid confirmation from sign-up, such as a QR code, email confirmation, or formal invitation. If your entry confirmation is invalid, you will be denied access without a refund.</li>
    </ul>

    <h2>3. Liability</h2>
    <ul>
        <li>Attendees participate at their own risk. à la mode and its affiliates will not be liable for any personal injury, property damage, theft, or loss that may occur during the event.</li>
        <li>You are responsible for your personal belongings. We encourage you to keep valuable items secured at all times.</li>
        <li>The organizers are not responsible for any travel disruptions, including international travel issues (e.g., visas, flights) that may prevent your attendance at the event.</li>
    </ul>

    <h2>4. Plus One Policy and Liability</h2>
    <ul>
        <li>à la mode events are designed to create a safe, supportive, and professional environment for models. We ask all attendees to be mindful of who they invite as their plus one to ensure the safety and comfort of the community.</li>
        <li>Each model is permitted to bring one guest (plus one) to the event. By accepting these terms, you acknowledge that you are fully responsible for the behavior and actions of your plus one.</li>
        <li>If your plus one engages in any inappropriate, disruptive, or harmful behavior, you will be held liable for their actions, and both you and your guest may be asked to leave the event without a refund.</li>
        <li>Plus ones must also comply with the event's Code of Conduct, and their attendance is subject to the same terms and conditions as the primary attendee.</li>
    </ul>

    <h2>5. Event Changes</h2>
    <ul>
        <li>à la mode reserves the right to change event details such as venue, schedule, performers, or dates without prior notice. Any significant changes will be communicated via email or on our website.</li>
        <li>The organizers are not responsible for any additional costs incurred due to changes (e.g., accommodation, travel costs).</li>
    </ul>

    <h2>6. Photography and Media</h2>
    <ul>
        <li>When you enter an à la mode event or program, you enter an area where photography, audio, and video recording may occur. By entering the event premises, you consent to interview(s), photography, audio recording, video recording, and their release, publication, exhibition, or reproduction to be used for news, webcasts, promotional purposes, telecasts, advertising, inclusion on websites, social media, or any other purpose by à la mode and its affiliates and representatives.</li>
        <li>Images, photos, and/or videos may be used to promote similar à la mode events in the future, highlight the event, and exhibit the capabilities of à la mode. You release à la mode, its officers, employees, and all persons involved from any liability connected with the taking, recording, digitizing, or publication and use of interviews, photographs, computer images, video, and/or sound recordings.</li>
        <li>By entering the event premises, you waive all rights you may have to any claims for payment or royalties in connection with any use, exhibition, streaming, webcasting, televising, or other publication of these materials, regardless of the purpose or sponsoring of such use, exhibiting, broadcasting, webcasting, or other publication irrespective of whether a fee for admission or sponsorship is charged.</li>
        <li>You also waive any right to inspect or approve any photo, video, or audio recording taken by à la mode or the person or entity designated to do so by à la mode. You have been fully informed of your consent, waiver of liability, and release before entering the event.</li>
        <li>Personal photography and videography for non-commercial use are permitted, provided they do not interfere with the event. Commercial use of any recordings is strictly prohibited unless prior written approval is obtained from the organizers.</li>
    </ul>

    <h2>7. International Laws and Regulations</h2>
    <ul>
        <li>Attendees travelling from abroad are responsible for complying with the visa and entry requirements of the host country.</li>
        <li>You are also responsible for any health or vaccination requirements needed for entry into the country where the event is taking place.</li>
    </ul>

    <h2>8. Force Majeure</h2>
    <ul>
        <li>à la mode will not be held liable for any delay or cancellation due to causes beyond our control, such as natural disasters, strikes, governmental actions, public health emergencies, or other 'force majeure' events.</li>
    </ul>

    <h2>9. Governing Law</h2>
    <ul>
        <li>These terms and conditions are governed by the laws of Ontario, Canada. Any disputes arising from or related to these terms will be resolved exclusively in the courts of Ontario, Canada.</li>
    </ul>

    <h2>10. Donations</h2>
    <ul>
        <li>à la mode accepts donations to support the event. However, donations do not grant entry to the event. If you are not part of our community and donate, you will not be refunded if you are denied entry.</li>
        <li>Donations are non-refundable under all circumstances, including if the event is cancelled or if entry is denied based on the eligibility criteria.</li>
    </ul>

    <h2>11. Indemnification</h2>
    <ul>
        <li>By attending the event or participating in any related activities, you agree to indemnify and hold harmless the founders, event organizers, employees, agents, and affiliates from any claims, damages, liabilities, or expenses arising from:
            <ul>
                <li>Your violation of these terms;</li>
                <li>Your participation in the event;</li>
                <li>Any personal injury or property damage caused by you during the event.</li>
            </ul>
        </li>
    </ul>

    <h2>12. Intellectual Property</h2>
    <ul>
        <li>All content provided on the À La Mode website, including logos, graphics, designs, and event material, is owned or licensed by the event organizers and is protected under copyright and intellectual property laws.</li>
        <li>Attendees are prohibited from using any intellectual property of the event for commercial purposes without prior written consent from the organizers.</li>
    </ul>

    <h2>13. Data Protection and Privacy</h2>
    <ul>
        <li>à la mode collects personal information from attendees and donors, including but not limited to names, contact details, and payment information, to facilitate event registration and donations.</li>
        <li>We are committed to protecting your privacy and will not share your personal information with third parties without your consent, except as required by law or for the processing of payments.</li>
        <li>By participating in the event, you consent to the collection, use, and storage of your personal information in accordance with our privacy policy.</li>
    </ul>

    <h2>14. Non-Disparagement</h2>
    <ul>
        <li>By attending the event or making donations, you agree not to make any public statements (including social media posts) that could harm the reputation of the founders, event organizers, or associated parties. This includes disparaging comments about the event, its management, or other attendees.</li>
    </ul>

    <h2>15. Severability</h2>
    <ul>
        <li>If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.</li>
    </ul>
      <Link href="/checkin" className={styles.link}>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.confirmationBtn}
            >
                GO BACK
            </motion.button>
        </Link>
      
    </motion.div>
      </motion.section>
    
    </motion.main>
  );
}
