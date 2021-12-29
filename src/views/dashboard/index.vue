<template>
    <div class="page dashboard-page mx-5">
        <dashboard-nav name="dashboard" />

        <content-top-header absolute class="__inner pl-0 my-3">
            <template slot="topHeader">
                <ul class="width100">
                    <li
                    v-for="tab in tabs"
                    :key="tab.id"
                    :href="`#${tab.id}`"
                    class="nav-li"
                    :class="[{ 'active d-nav-active': isActiveTab(tab.id) }, `nav-${tab.id}`]"
                    >
                    <label class="nav-label black--text" @click="setInnerMenuTabs(tab.id)">
                        {{ tab.title }}
                    </label>
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

        <v-container fluid grid-list-lg>
            <v-layout row wrap class="inner-tab-actions">
                <v-flex 
                    v-for="(action, i) in setInnerTab()" 
                    :key="i"
                    xs12
                    :sm="`sm${action.size}`"
                    class="inner-tab-action"
                    :class="[{'inner-tab-active': isActiveInnerTab(action.id)}, action.size == 'custom' ? 'custom-lg5' : action.size ? `sm${action.size}` : '']"
                    @click="activeInnerTab = action.id"
                >
                    <div class="action_content">
                        <div>{{ action.value }}</div>
                        <div>{{ action.title }}</div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </div>  
</template>

<script src="./dashboard.ctrl.js"></script>
<style src="../../../static/styles/dashboard.scss" lang="scss" scoped></style>
