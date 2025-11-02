const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'c++', 'java'],
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error', 'timeout'],
        default: 'pending',
        index: true
    },
    executionDetails: {
        runtime: {
            type: Number,
            default: 0
        },
        memory: {
            type: Number,
            default: 0
        },
        testCasesPassed: {
            type: Number,
            default: 0
        },
        testCasesTotal: {
            type: Number,
            default: 0
        }
    },
    errorDetails: {
        errorMessage: {
            type: String,
            default: ''
        },
        errorType: {
            type: String,
            enum: ['compilation', 'runtime', 'timeout', 'memory_limit'],
            default: null
        }
    },
    judge0Response: {
        tokens: [String],
        submissions: Schema.Types.Mixed
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Compound indexes for efficient querying
submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, status: 1 });
submissionSchema.index({ problemId: 1, status: 1 });

const Submission = mongoose.model('submission', submissionSchema);
module.exports = Submission;
