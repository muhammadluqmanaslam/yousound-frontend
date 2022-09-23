<template>
    <div class="page dashboard-page side-space" v-if="(currentUser.plan === 'pro' || current_user.plan === 'plus') && currentUser.creator_verified">
        <dashboard-nav name="dashboard" />

        <content-top-header absolute class="__inner px-0 my-3">
            <template slot="topHeader">
                <ul class="width100">
                    <li
                    v-for="tab in tabs"
                    :key="tab.id"
                    :href="`#${tab.id}`"
                    class="nav-li"
                    :class="[{ 'active d-nav-active': isActiveTab(tab.id) }, `nav-${tab.id}`]"
                    >
                    <label class="nav-label black--text" @click="setTopMenu(tab.id)">
                        {{ tab.title }}
                    </label>
                    </li>

                    <v-spacer></v-spacer>

                    <li>&nbsp;<li>


                    <li class="tabSelectMenu">
                        <v-select
                        v-if="!onMobile"
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
        <v-select
        v-if="onMobile"
        v-model="daysFilter"
        :items="tabFilterOptions"
        item-text="title"
        item-value="value"
        hide-details
        class="input-txt-center"
        ></v-select>

        <div class="chart-parent">
            <!-- Button Actions -->
            <v-container fluid grid-list-lg px-0>
                <v-layout row wrap class="inner-tab-actions">
                    <v-flex 
                        v-for="(action, i) in getInnerTab()" 
                        :key="i"
                        xs12
                        class="inner-tab-action"
                        :class="[{'inner-tab-active': isActiveInnerTab(action.id)}, action.size == 'custom' ? 'custom-lg5' : action.size ? `sm${action.size}` : '']"
                        @click="setChartDetails(action)"
                    >
                        <div class="action_content">
                            <div class="action_value">
                                <span v-if="typeof action.value == 'number'">{{ action.value | formatNumberWithComma }}</span>
                                <span v-else>{{ action.value }}</span>
                            </div>
                            <div class="action_title">{{ action.title }}</div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>

            <!-- selectedInnerTab: <pre></pre> -->

            <!-- Charts -->
            <v-container fluid px-0>
                <!-- Graph Chart -->
                <div class="graph-chart chart-wrapper">
                    <div class="chart-header">
                        <content-top-header v-if="showChartHeader.indexOf(activeTab) > -1 && selectedInnerTab.breakdown.length > 1" absolute :height="!onMobile ? 20: ''" class="__inner pl-0 ml-3">
                            <template slot="topHeader">
                                <ul class="chart-header-tabs width100">
                                    <li
                                        v-for="tab in selectedInnerTab.breakdown"
                                        :key="tab.id"
                                        :href="`#${tab.value}`"
                                        class="nav-li"
                                        :class="[{ 'active d-nav-active': isActiveChart(tab.value) }, `nav-${tab.id}`]"
                                    >
                                    <label class="nav-label black--text" @click="setActiveChart(tab)">
                                        {{ tab.title }}
                                    </label>
                                    </li>

                                    <v-spacer></v-spacer>
                                    <li>
                                        <h2>{{ selectedInnerTab.value | formatNumberWithComma }}</h2>
                                    </li>
                                </ul>
                            </template>
                        </content-top-header>
                        <h2 v-else>{{ selectedInnerTab.title }}</h2>
                    </div>

                    <!-- selectedInnerTab: {{ selectedInnerTab }} <br> <br> -->
                    <!-- activeInnerTab: {{ activeInnerTab }} <br> -->
                    <!-- selectedChart: {{ selectedChart }} <br> -->
                    <!-- activeChart: {{ activeChart }} <br> -->


                    <div v-if="selectedChart == null" class="no-chart allChildrenCenter">
                        No timeline data available
                    </div>

                    <div v-else id="chart" :class="[activeInnerTab ? `${activeInnerTab}-chart` : '']">
                        <chart type="area" height="250" :options="chartOptions" :series="selectedChart.series" style="width: inherit;"></chart>
                    </div>
                </div>
            </v-container>
        </div>
        <!-- Pie Chart -->
        <div v-if="getSummaryTabs()" class="col-summary-section">
            <v-container fluid grid-list-lg px-0>
                <v-layout row wrap  justify-space-between>
                    <v-flex xs12 custom-lg3plus v-for="(col, i) in getSummaryTabs()" :key="i" col-summary>
                        <div class="col-summary-frame">
                            <div class="col-summary-frame-header">
                                <h4>{{ col.header }}</h4>
                            </div>
                            
                            <div v-if="col.type == 'pie'" class="col-summary-frame-body">
                                <div id="chart" class="pie-chart">
                                    <chart type="donut" height="500" :options="pieChartOptions" :series="pieSeries"></chart>

                                    {{ chartOptions.color }}
                                </div>
                            </div>

                            <div v-else class="col-summary-frame-body">
                                <div v-for="(item, i) in 7" :key="i" class="col-listing" :class="[col.avatarType == 'square' ? '__square' : col.avatarType == 'round' ? '__round' : col.avatarType == 'rectangle' ? '__rectangle':  '' ]">
                                    <div class="_thumbnail"></div>
                                    <div class="_title">First Last</div>
                                </div>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <!-- Data Table Chart -->
        <v-container v-if="getDataTables()" fluid data-table-section px-0 mt-5>
            <div
                v-for="(table, i) in getDataTables()"
                :key="i"
                class="mb-4"
            >
                <h4 class="data-table-title mb-3">{{ table.title }}</h4>
                <v-data-table
                    :headers="table.headers"
                    :items="table.data"
                    class="elevation-1"
                >
                <!-- {{ props }} -->

                    <!-- <template slot="data" slot-scope="{ item }">
                        {{ item }}
                    </template> -->



                    <!-- For Overview -->
                    <template slot="items" slot-scope="props">
                        <td v-for="header in table.headers" :key="header.value">
                            <span class="ml-3">
                                {{ props.item[header.value] }}
                            </span>
                        </td>
                    </template>
                </v-data-table>
            </div>
        </v-container>
    </div>  
</template>

<script src="./dashboard.ctrl.js"></script>
<style src="../../../static/styles/dashboard.scss" lang="scss" scoped></style>
