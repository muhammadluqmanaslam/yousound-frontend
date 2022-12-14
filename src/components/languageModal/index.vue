<template>
    <v-container pa-0 class="genre">
        <div class="dflex justify-space-between align-center">
            <div class="">
                <h3 class="_title">Language preferences</h3>
                <div class="_subtitle d-block justify-space-between">
                    <p>Select your language</p>
                </div>
            </div>
            <div class="dflex align-center">

                <v-btn round dark color="black" class="update-btn">
                    Save
                </v-btn>

            </div>

        </div>
        <v-container fluid grid-list-lg px-0 pt-0>
            <v-layout row wrap mt-4 class="pgs_area">
                <v-flex class="pgs-wrapper" xs12 sm2>
                    <div class="pgs">
                        <div class="pgs-inner-wrapper selected">
                            <div class="pgs-inner">

                                <div class="dflex align-center justify-space-between">
                                    <div class="pgs__title mb-0">
                                        <div class="dflex align-center">
                                            <img src="../../assets/uk-flag.svg" width="20">

                                            <label class="ml-2 flag-label">English</label>
                                        </div>
                                    </div>
                                    <div class="highlight-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-flex>
                <v-flex class="pgs-wrapper" xs12 sm2>
                    <div class="pgs">
                        <div class="pgs-inner-wrapper">
                            <div class="pgs-inner">

                                <div class="dflex align-center justify-space-between">
                                    <div class="pgs__title mb-0">
                                        <div class="dflex align-center">
                                            <img src="../../assets/uk-flag.svg" width="20">

                                            <label class="ml-2 flag-label">English</label>
                                        </div>
                                    </div>
                                    <div class="highlight-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script src="./language.ctrl.js"></script>
