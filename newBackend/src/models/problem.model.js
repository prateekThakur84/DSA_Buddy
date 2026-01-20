    const mongoose = require('mongoose');
    const { Schema } = mongoose;

    const problemSchema = new Schema({
        title: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true,
            index: true
        },
        tags: [{
            type: String,
            enum: ['array', 'linkedList', 'graph', 'dp', 'string', 'hash table', 'math'],
            index: true
        }],
        visibleTestCases: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }],
        hiddenTestCases: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }],
        startCode: [{
            language: {
                type: String,
                required: true,
                enum: ['javascript', 'c++', 'java']
            },
            initialCode: {
                type: String,
                required: true
            }
        }],
        referenceSolution: [{
            language: {
                type: String,
                required: true,
                enum: ['javascript', 'c++', 'java']
            },
            completeCode: {
                type: String,
                required: true
            }
        }],
        problemCreator: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        statistics: {
            totalSubmissions: {
                type: Number,
                default: 0
            },
            acceptedSubmissions: {
                type: Number,
                default: 0
            },
            acceptanceRate: {
                type: Number,
                default: 0
            }
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        }
    }, { 
        timestamps: true 
    });

    // Compound indexes for better query performance
    problemSchema.index({ difficulty: 1, tags: 1 });
    problemSchema.index({ isActive: 1, difficulty: 1 });
    problemSchema.index({ problemCreator: 1, createdAt: -1 });

    // Update acceptance rate on submission
    problemSchema.methods.updateStatistics = function() {
        if (this.statistics.totalSubmissions > 0) {
            this.statistics.acceptanceRate = 
                (this.statistics.acceptedSubmissions / this.statistics.totalSubmissions) * 100;
        }
    };

    const Problem = mongoose.model('problem', problemSchema);
    module.exports = Problem;
