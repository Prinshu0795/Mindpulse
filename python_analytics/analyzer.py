import pandas as pd
import numpy as np
from scipy.stats import pearsonr
from typing import List, Dict, Any

def sanitize_numpy(obj):
    if isinstance(obj, dict):
        return {k: sanitize_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_numpy(v) for v in obj]
    elif isinstance(obj, (np.integer, np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return sanitize_numpy(obj.tolist())
    elif isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    elif pd.isna(obj):
        return None
    return obj

def analyze_user_data(legacy: List[Dict[str, Any]], mental: List[Dict[str, Any]], checkins: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Convert to DataFrames
    df_legacy = pd.DataFrame(legacy) if legacy else pd.DataFrame()
    df_mental = pd.DataFrame(mental) if mental else pd.DataFrame()
    df_checkins = pd.DataFrame(checkins) if checkins else pd.DataFrame()

    results = {
        "status": "success",
        "current_scores": {},
        "trends": {},
        "stress_triggers": [],
        "sleep_energy": {},
        "correlations": {},
        "insights": []
    }

    # 1. Analyze Mental Assessments (PSS-10, GAD-7, PHQ-9, WHO-5)
    if not df_mental.empty:
        # Ensure dates are datetime
        df_mental['completedAt'] = pd.to_datetime(df_mental.get('completedAt', pd.Series()))
        df_mental = df_mental.sort_values('completedAt')
        
        for assess_type in df_mental['type'].unique():
            type_df = df_mental[df_mental['type'] == assess_type]
            if len(type_df) > 0:
                latest = type_df.iloc[-1]
                current_score = latest['score'] if not pd.isna(latest.get('score')) else 0
                
                # Check for DASS-21 (uses subScores instead of single score)
                if assess_type == 'DASS-21' and 'subScores' in latest and pd.notna(latest['subScores']):
                    current_score = sum(v for v in latest['subScores'].values() if isinstance(v, (int, float))) if isinstance(latest['subScores'], dict) else 0

                results["current_scores"][assess_type] = {
                    "score": current_score,
                    "severity": latest.get('severity', 'Unknown'),
                    "date": latest['completedAt'].isoformat() if pd.notnull(latest['completedAt']) else None
                }
                
                if len(type_df) > 1:
                    prev = type_df.iloc[-2]
                    prev_score = prev['score'] if not pd.isna(prev.get('score')) else 0
                    if assess_type == 'DASS-21' and 'subScores' in prev and pd.notna(prev['subScores']):
                        prev_score = sum(v for v in prev['subScores'].values() if isinstance(v, (int, float))) if isinstance(prev['subScores'], dict) else 0

                    change = current_score - prev_score
                    
                    if assess_type == 'WHO-5':
                        # Higher is better
                        trend = "Improving" if change > 0 else "Declining" if change < 0 else "Stable"
                    else:
                        # Lower is better (PSS, GAD, PHQ, DASS)
                        trend = "Improving" if change < 0 else "Declining" if change > 0 else "Stable"
                        
                    results["trends"][assess_type] = {
                        "trend": trend,
                        "change": float(change),
                        "previous": float(prev_score)
                    }
                    
                    if change != 0:
                        direction = "decreased" if change < 0 else "increased"
                        word = "improvement" if trend == "Improving" else "decline"
                        results["insights"].append(
                            f"Your {assess_type} score has {direction} by {abs(float(change))} points since your last assessment, indicating an {word}."
                        )

    # 2. Analyze Check-ins (Sleep, Energy, Triggers)
    if not df_checkins.empty:
        df_checkins['createdAt'] = pd.to_datetime(df_checkins.get('createdAt', pd.Series()))
        df_checkins = df_checkins.sort_values('createdAt')
        
        # Sleep and Energy averages
        if 'sleepQuality' in df_checkins.columns and 'energyLevel' in df_checkins.columns:
            recent_checkins = df_checkins.tail(7)
            avg_sleep = recent_checkins['sleepQuality'].mean()
            avg_energy = recent_checkins['energyLevel'].mean()
            
            latest_sleep = df_checkins.iloc[-1]['sleepQuality']
            latest_energy = df_checkins.iloc[-1]['energyLevel']
            
            results["sleep_energy"] = {
                "average_sleep": round(float(avg_sleep), 1),
                "average_energy": round(float(avg_energy), 1),
                "latest_sleep": float(latest_sleep),
                "latest_energy": float(latest_energy)
            }
            
            if avg_sleep < 6:
                results["insights"].append("Your average sleep quality has been low recently. Consider prioritizing rest.")
            if avg_energy > 7:
                results["insights"].append("Your energy levels have been consistently good recently.")
                
            # Correlation between Sleep and Energy
            if len(df_checkins) >= 5:
                # Remove rows with NaN in these columns
                valid_data = df_checkins.dropna(subset=['sleepQuality', 'energyLevel'])
                if len(valid_data) >= 5 and valid_data['sleepQuality'].nunique() > 1 and valid_data['energyLevel'].nunique() > 1:
                    try:
                        corr, p_value = pearsonr(valid_data['sleepQuality'], valid_data['energyLevel'])
                        if not np.isnan(corr):
                            results["correlations"]["sleep_energy"] = round(float(corr), 2)
                            if corr > 0.5 and p_value < 0.1:
                                results["insights"].append("Your data shows a strong positive relationship between your sleep quality and energy levels.")
                            elif corr < -0.5 and p_value < 0.1:
                                results["insights"].append("Interestingly, your data shows a negative correlation between sleep and energy.")
                    except Exception:
                        pass

        # Triggers
        all_triggers = []
        if 'stressTriggers' in df_checkins.columns:
            for triggers in df_checkins['stressTriggers'].dropna():
                if isinstance(triggers, list):
                    all_triggers.extend(triggers)
                elif isinstance(triggers, str):
                    all_triggers.append(triggers)
        
        if not df_legacy.empty and 'trigger' in df_legacy.columns:
            legacy_triggers = [t for t in df_legacy['trigger'].dropna() if t != 'Unknown']
            all_triggers.extend(legacy_triggers)
            
        if all_triggers:
            trigger_counts = pd.Series(all_triggers).value_counts()
            results["stress_triggers"] = [{"name": k, "count": int(v)} for k, v in trigger_counts.head(5).items()]
            
            top_trigger = results["stress_triggers"][0]
            if top_trigger["count"] > 2:
                results["insights"].append(f"'{top_trigger['name']}' has been one of your most frequently recorded stress triggers.")

    if not results["insights"]:
        results["insights"].append("Complete more assessments over time to unlock deeper personalized insights.")

    return sanitize_numpy(results)
