<template>
    <div class="page dashboard-page mx-5">
        <dashboard-nav name="dashboard" />

        <content-top-header class="__inner">
        <template slot="topHeader">
            <ul class="width100">
                <li
                    v-for="tab in getInnerMenuTabs(activeInnerFilter)"
                    :key="tab.id"
                    :href="`#${tab.id}`"
                    :class="{ active: isActiveInnerTab(tab.id) }"
                >
                    <label @click="setInnerTab(tab.id)">{{ tab.title }}</label>
                </li>

                <v-spacer></v-spacer>

                <li class="tabSelectMenu">
                    <v-select
                    v-model="daysFilter"
                    :items="tabFilterOptions"
                    item-text="title"
                    item-value="value"
                    hide-details
                    ></v-select>
                </li>
            </ul>
        </template>
        </content-top-header>
    </div>  
</template>

<script src="./dashboard.ctrl.js"></script>
<style src="../../../static/styles/dashboard.scss" lang="scss" scoped></style>
