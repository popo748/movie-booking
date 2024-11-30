<template>
  <v-footer height="40" app fixed class="footer">
    <div class="footer-texts">
      <span @click="openDialog('copyright')">Copyright</span>

      <div class="divider"></div>

      <span @click="openDialog('tandc')">Terms & Conditions</span>

      <div class="divider"></div>

      <span @click="openDialog('policy')">Privacy & Policy</span>
    </div>

    <!-- <div class="footer-icon">
      <v-icon @click="openChat">mdi-chat-processing-outline</v-icon>
    </div> -->

    <v-dialog v-model="dialogVisible" max-width="800px">
      <v-card>
        <v-card-title class="headline text-center">{{ dialogTitle }}</v-card-title>
        <v-card-text class="dialog-text">
          <p v-if="selectedOption === 'copyright'">
            Motion pictures have been protected under American copyright law since 1912. 
            Filmmakers have a series of exclusive rights to their work, including the right to make copies and the right to control public performances of the work. More on these rights is available on the Copyright Office's website.
            Since 1978, it has not been necessary to register a copyright to obtain protection, but a lawsuit for copyright infringement requires the work to be registered.
          </p>

          <p v-if="selectedOption === 'tandc'">
            By accessing and using our website, you agree to comply with and be bound by our Terms & Conditions. Please review these carefully. We may revise these terms at any time, and your continued use of the website constitutes acceptance of the updated terms.
            The website may contain links to third-party websites, which are not controlled by us, and we assume no responsibility for their content or policies.
          </p>

          <p v-if="selectedOption === 'policy'">
            We are committed to safeguarding your privacy. We collect personal information such as your name, email, and payment details when booking tickets, which we use to process your orders and enhance your experience. Your data is protected with secure technologies, but no security measure is completely foolproof.
            We do not share your information with third parties, except for trusted service providers to process transactions or when required by law.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      selectedOption: '',
      dialogTitle: ''
    };
  },
  methods: {
    openDialog(option) {
      this.selectedOption = option;
      this.dialogTitle = this.getDialogTitle(option);
      this.dialogVisible = true;
    },
    getDialogTitle(option) {
      switch (option) {
        case 'copyright':
          return 'Copyright Information';
        case 'tandc':
          return 'Terms & Conditions';
        case 'policy':
          return 'Privacy & Policy';
        default:
          return '';
      }
    },
    openChat() {
      console.log('Chat Icon Clicked');
    }
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent !important;
}

.footer-texts {
  display: flex;
  align-items: center;
}

.divider {
  height: 20px;
  width: 1px;
  background-color: #ccc; 
  margin: 0 10px;
}

.footer-icon {
  margin-right: 10px;
}

.v-btn {
  background-color: transparent;
}

.dialog-text {
  text-align: justify;
}
</style>
