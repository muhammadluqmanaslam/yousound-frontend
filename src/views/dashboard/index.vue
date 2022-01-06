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

        <!-- Button Actions -->
        <v-container fluid grid-list-lg pl-0>
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

        <v-container fluid pl-0>
            <div class="graph-chart chart-wrapper">
                <div class="chart-header">
                    <content-top-header v-if="showChartHeader.indexOf(activeTab) > -1 && selectedInnerTab.breakdown.length > 1" absolute height="20" class="__inner pl-0 ml-3">
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
                    <chart type="area" height="250" width="100%" :options="chartOptions" :series="selectedChart.series"></chart>
                </div>
            </div>

            <div v-if="getSummaryTabs()" class="col-summary-section">
                <v-container fluid grid-list-lg px-0>
                    <v-layout row wrap  justify-space-between>
                        <v-flex v-for="(col, i) in getSummaryTabs()" :key="i" xs3 col-summary>
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
                                    <div v-for="(item, i) in 7" :key="i" class="col-listing" :class="[col.avatarType == 'square' ? '__square' : col.avatarType == 'round' ? '__round' : '' ]">
                                        <div class="_thumbnail"></div>
                                        <div class="_title">First Last</div>
                                    </div>
                                </div>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
            </div>

            <v-container v-if="getDataTables()" fluid data-table px-0 mt-5>
                <template>
                    <v-data-table
                        v-for="(table, i) in getDataTables()"
                        :key="i"
                        :headers="table.headers"
                        :items="table.data"
                        class="elevation-1"
                    >
                    </v-data-table>
                </template>
            </v-container>
        </v-container>
    </div>  
</template>

<script src="./dashboard.ctrl.js"></script>
<style src="../../../static/styles/dashboard.scss" lang="scss" scoped></style>
