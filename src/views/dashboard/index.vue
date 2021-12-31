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
                    v-for="(action, i) in getInnerTab()" 
                    :key="i"
                    xs12
                    :sm="`sm${action.size}`"
                    class="inner-tab-action"
                    :class="[{'inner-tab-active': isActiveInnerTab(action.id)}, action.size == 'custom' ? 'custom-lg5' : action.size ? `sm${action.size}` : '']"
                    @click="getChartDetails(action)"
                >
                    <div class="action_content">
                        <div>{{ action.value }}</div>
                        <div>{{ action.title }}</div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container fluid>
            <div class="graph-chart chart-wrapper">
                <div class="chart-header">
                    <content-top-header v-if="showChartHeader.indexOf(activeTab) > -1" absolute height="20" class="__inner pl-0">
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
                                    <h2>${{ selectedInnerTab.value | formatNumberWithComma }}</h2>
                                </li>
                            </ul>
                        </template>
                    </content-top-header>
                    <h2 v-else>{{ selectedInnerTab.header }}</h2>
                </div>

                <!-- selectedInnerTab: {{ selectedInnerTab }} <br> <br>
                activeInnerTab: {{ activeInnerTab }} <br>
                selectedChart: {{ selectedChart }} <br>
                activeChart: {{ activeChart }} <br> -->

                <div id="chart" :class="[activeInnerTab ? `${activeInnerTab}-chart` : '']">
                    <chart type="area" height="250" width="100%" :options="chartOptions" :series="selectedChart.series"></chart>
                </div>
            </div>

            <div class="col-summary-section">
                <v-container fluid grid-list-lg>
                    <v-layout row wrap  justify-space-between>
                        <v-flex xs3 col-summary>
                            <div class="col-summary-frame">
                                <div class="col-summary-frame-header">
                                    <h4>Top Albums</h4>
                                </div>
                                <div class="col-summary-frame-body">
                                    <div v-for="(item, i) in 7" :key="i" class="col-listing __square">
                                        <div class="_thumbnail"></div>
                                        <div class="_title">Album Name</div>
                                    </div>
                                </div>
                            </div>
                        </v-flex>

                        <v-flex xs3 col-summary>
                            <div class="col-summary-frame">
                                <div class="col-summary-frame-header">
                                    <h4>Plays by Country</h4>
                                </div>
                                <div class="col-summary-frame-body">
                                    <div id="chart" class="pie-chart">
                                        <chart type="donut" height="500" :options="pieChartOptions" :series="pieSeries"></chart>

                                        {{ chartOptions.color }}
                                    </div>
                                </div>
                            </div>
                        </v-flex>

                        
                        <v-flex xs3 col-summary>
                            <div class="col-summary-frame">
                                <div class="col-summary-frame-header">
                                    <h4>Top Listeners</h4>
                                </div>
                                <div class="col-summary-frame-body">
                                    <div v-for="(item, i) in 7" :key="i" class="col-listing __round">
                                        <div class="_thumbnail"></div>
                                        <div class="_title">Album Name</div>
                                    </div>
                                </div>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>

                <v-container fluid>
                    <template>
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            class="elevation-1"
                        >

                            <template v-slot:[`item.name`]="{ item }">
                                {{ item }}
                                <!-- <v-img
                                :src="item.image || require('@/assets/imgUpload.jpg')"
                                height="50px"
                                width="50px"
                                style="margin: 0 auto"
                                ></v-img> -->
                            </template>
                            <!-- <template v-slot:items="props">
                            <td>{{ props.item.name }}</td>
                            <td class="text-xs-right">{{ props.item.calories }}</td>
                            <td class="text-xs-right">{{ props.item.fat }}</td>
                            <td class="text-xs-right">{{ props.item.carbs }}</td>
                            <td class="text-xs-right">{{ props.item.protein }}</td>
                            <td class="text-xs-right">{{ props.item.iron }}</td>
                            </template> -->

                            <div>
                                123
                            </div>
                        </v-data-table>
                    </template>
                </v-container>
            </div>
        </v-container>
    </div>  
</template>

<script src="./dashboard.ctrl.js"></script>
<style src="../../../static/styles/dashboard.scss" lang="scss" scoped></style>
